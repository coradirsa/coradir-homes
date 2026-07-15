import { NextRequest, NextResponse } from "next/server";
import { processLeadBotMessage } from "@/lib/leadBot/service";
import type { LeadBotApiRequest } from "@/lib/leadBot/types";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestLog = new Map<string, number[]>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function pruneStaleRateLimitEntries(now: number) {
  for (const [key, timestamps] of requestLog) {
    if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
      requestLog.delete(key);
    }
  }
}

function isRateLimited(key: string) {
  const now = Date.now();
  if (requestLog.size > 500) pruneStaleRateLimitEntries(now);
  const recent = (requestLog.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

function isValidRequest(value: unknown): value is LeadBotApiRequest {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<LeadBotApiRequest>;
  return (
    typeof payload.clientId === "string" &&
    payload.clientId.length >= 8 &&
    typeof payload.message === "string" &&
    payload.message.trim().length > 0 &&
    payload.message.length <= 1200
  );
}

export async function POST(request: NextRequest) {
  // Pausa operativa: el bot queda conservado para reactivarlo mas adelante,
  // pero ninguna configuracion vieja de Portainer puede habilitar este endpoint.
  if (isLeadBotTemporarilyDisabled()) {
    return NextResponse.json(
      { success: false, error: "El asistente se encuentra temporalmente deshabilitado." },
      { status: 503 }
    );
  }

  try {
    const payload = await request.json().catch(() => null);

    if (!isValidRequest(payload)) {
      return NextResponse.json(
        { success: false, error: "Payload inválido." },
        { status: 400 }
      );
    }

    const rateLimitKey = `${getClientIp(request)}:${payload.clientId}`;
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
        { status: 429 }
      );
    }

    const result = await processLeadBotMessage({
      ...payload,
      message: payload.message.trim(),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Error en lead bot:", error);
    return NextResponse.json(
      {
        success: false,
        error: "No pudimos procesar tu mensaje. Dejanos tus datos y te contactamos.",
      },
      { status: 500 }
    );
  }
}

function isLeadBotTemporarilyDisabled() {
  return true;
}
