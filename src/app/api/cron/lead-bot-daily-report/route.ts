import { NextRequest, NextResponse } from "next/server";
import { sendDailyLeadBotReport } from "@/lib/leadBot/dailyReport";

export async function POST(request: NextRequest) {
  const secret = process.env.LEAD_BOT_CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ success: false }, { status: 401 });
  try {
    const body = await request.json().catch(() => ({}));
    const result = await sendDailyLeadBotReport(typeof body.date === "string" ? body.date : undefined);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Daily lead bot report error:", error);
    return NextResponse.json({ success: false, error: "No se pudo generar el reporte" }, { status: 500 });
  }
}
