import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { invalidarCatalogo } from "@/lib/catalogo/client";

function autorizado(request: NextRequest) {
  const secreto = process.env.HOMES_REVALIDATE_SECRET;
  const header = request.headers.get("authorization") || "";
  if (!secreto) return false;
  const esperado = Buffer.from(`Bearer ${secreto}`);
  const recibido = Buffer.from(header);
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}

/**
 * Inmobiliario avisa que cambio el catalogo (unidad publicada, contrato nuevo,
 * reserva, etc.): se limpia el cache en memoria y la proxima visita trae datos frescos.
 */
export async function POST(request: NextRequest) {
  if (!autorizado(request)) return NextResponse.json({ success: false }, { status: 401 });
  const entradas = invalidarCatalogo();
  return NextResponse.json({ success: true, invalidadas: entradas, timestamp: new Date().toISOString() });
}
