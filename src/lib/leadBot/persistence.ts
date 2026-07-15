import { Pool } from "pg";
import type { LeadBotState, LeadBotTracking } from "./types";

export type BotEventType =
  | "bot_opened" | "user_message" | "bot_reply" | "contact_requested"
  | "contact_provided" | "contact_declined" | "whatsapp_cta_shown"
  | "whatsapp_clicked" | "crm_submitted" | "crm_submit_failed";

let pool: Pool | undefined;

function getPool() {
  const connectionString = process.env.LEAD_BOT_DATABASE_URL;
  if (!connectionString) return null;
  pool ||= new Pool({ connectionString, max: 5, ssl: process.env.LEAD_BOT_DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
  return pool;
}

export async function persistConversation(input: {
  state: LeadBotState;
  tracking?: LeadBotTracking;
  events: Array<{ type: BotEventType; payload?: Record<string, unknown> }>;
}) {
  const db = getPool();
  if (!db) return { skipped: true };
  const { state, tracking, events } = input;
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO lead_bot_sessions
        (client_id, started_at, last_activity_at, name, email, phone, project, intent,
         classification, score, wants_human_handoff, declined_contact, crm_submitted_at,
         crm_lead_id, tracking, messages, message_count)
       VALUES ($1, COALESCE((SELECT started_at FROM lead_bot_sessions WHERE client_id=$1), NOW()), NOW(),
         $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (client_id) DO UPDATE SET
         last_activity_at=NOW(), name=EXCLUDED.name, email=EXCLUDED.email, phone=EXCLUDED.phone,
         project=EXCLUDED.project, intent=EXCLUDED.intent, classification=EXCLUDED.classification,
         score=EXCLUDED.score, wants_human_handoff=EXCLUDED.wants_human_handoff,
         declined_contact=EXCLUDED.declined_contact, crm_submitted_at=EXCLUDED.crm_submitted_at,
         crm_lead_id=EXCLUDED.crm_lead_id, tracking=lead_bot_sessions.tracking || EXCLUDED.tracking,
         messages=EXCLUDED.messages, message_count=EXCLUDED.message_count`,
      [state.clientId, state.name, state.email, state.phone, state.project, state.intent,
       state.classification, state.score, Boolean(state.wantsHumanHandoff), Boolean(state.declinedContact),
       state.crmSubmittedAt || null, state.crmLeadId || null, JSON.stringify(tracking || {}),
       JSON.stringify(state.messages), state.messages.length]
    );
    for (const event of events) {
      await client.query(
        "INSERT INTO lead_bot_events (client_id, event_type, payload) VALUES ($1,$2,$3)",
        [state.clientId, event.type, JSON.stringify(event.payload || {})]
      );
    }
    await client.query("COMMIT");
    return { skipped: false };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}

export async function persistClientEvent(clientId: string, type: BotEventType, payload: Record<string, unknown> = {}) {
  const db = getPool();
  if (!db) return { skipped: true };
  await db.query(
    `INSERT INTO lead_bot_sessions (client_id, started_at, last_activity_at, tracking, messages, message_count)
     VALUES ($1,NOW(),NOW(),$2,'[]',0)
     ON CONFLICT (client_id) DO UPDATE SET last_activity_at=NOW(), tracking=lead_bot_sessions.tracking || EXCLUDED.tracking`,
    [clientId, JSON.stringify(payload.tracking || {})]
  );
  await db.query("INSERT INTO lead_bot_events (client_id,event_type,payload) VALUES ($1,$2,$3)", [clientId, type, JSON.stringify(payload)]);
  return { skipped: false };
}

export function leadBotPool() { return getPool(); }
