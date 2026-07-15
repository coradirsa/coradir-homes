import { NextRequest, NextResponse } from "next/server";
import { persistClientEvent, type BotEventType } from "@/lib/leadBot/persistence";

const allowed = new Set<BotEventType>(["bot_opened", "whatsapp_clicked"]);
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.clientId !== "string" || body.clientId.length < 8 || !allowed.has(body.type))
    return NextResponse.json({ success: false }, { status: 400 });
  try {
    await persistClientEvent(body.clientId, body.type, typeof body.payload === "object" ? body.payload : {});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead bot event persistence error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
