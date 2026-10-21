import { NextRequest, NextResponse } from "next/server";

/**
 * Clic en un boton de WhatsApp: el navegador manda el codigo de referencia que va en el
 * mensaje junto con la campaña de la visita, y este endpoint lo reenvia al CRM
 * (con el token de integracion, que nunca llega al navegador).
 * Siempre responde 204: el registro es best-effort y no debe trabar al usuario.
 */
const CAMPOS_TEXTO = [
  "refCode",
  "proyecto",
  "placement",
  "pagePath",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "gclid",
  "fbclid",
  "landingUrl",
  "referrer",
] as const;

function limpiar(body: Record<string, unknown>) {
  const datos: Record<string, string> = {};
  for (const campo of CAMPOS_TEXTO) {
    const valor = body[campo];
    if (typeof valor === "string" && valor.trim()) datos[campo] = valor.trim().slice(0, 1000);
  }
  return datos;
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.HOMES_CRM_BASE_URL?.replace(/\/+$/, "");
  const token = process.env.HOMES_CRM_WEBHOOK_TOKEN || process.env.HOMES_WEBHOOK_TOKEN;
  if (!baseUrl || !token) return new NextResponse(null, { status: 204 });

  let datos: Record<string, string>;
  try {
    const texto = await request.text();
    if (texto.length > 8000) return new NextResponse(null, { status: 204 });
    datos = limpiar(JSON.parse(texto));
  } catch {
    return new NextResponse(null, { status: 204 });
  }
  if (!/^[A-Z0-9]{2,4}-[A-Z0-9]{4,6}$/.test(datos.refCode || "")) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    await fetch(`${baseUrl}/api/homes/ingest/whatsapp-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-homes-token": token },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("[atribucion] No se pudo registrar el clic de WhatsApp en el CRM:", (error as Error).message);
  }
  return new NextResponse(null, { status: 204 });
}
