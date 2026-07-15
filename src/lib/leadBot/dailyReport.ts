import nodemailer from "nodemailer";
import { leadBotPool } from "./persistence";

const TZ = "America/Argentina/Buenos_Aires";

export async function sendDailyLeadBotReport(date?: string) {
  const db = leadBotPool();
  if (!db) throw new Error("LEAD_BOT_DATABASE_URL no configurado");
  const reportDate = date || new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(Date.now() - 86400000));
  const { rows: [metrics] } = await db.query(
    `WITH bounds AS (
       SELECT ($1::date::timestamp AT TIME ZONE $2) AS from_at,
              (($1::date + 1)::timestamp AT TIME ZONE $2) AS to_at
     ), sessions AS (
       SELECT s.* FROM lead_bot_sessions s, bounds b
       WHERE s.started_at >= b.from_at AND s.started_at < b.to_at
     ), events AS (
       SELECT e.* FROM lead_bot_events e, bounds b
       WHERE e.occurred_at >= b.from_at AND e.occurred_at < b.to_at
     ) SELECT
       (SELECT count(*) FROM sessions)::int AS sessions,
       (SELECT count(*) FROM sessions WHERE message_count > 0)::int AS conversations,
       (SELECT coalesce(sum(message_count),0) FROM sessions)::int AS messages,
       (SELECT count(*) FROM sessions WHERE name IS NOT NULL AND (email IS NOT NULL OR phone IS NOT NULL))::int AS contacts,
       (SELECT count(*) FROM sessions WHERE crm_submitted_at IS NOT NULL)::int AS crm_submitted,
       (SELECT count(*) FROM events WHERE event_type='whatsapp_clicked')::int AS whatsapp_clicked,
       (SELECT count(*) FROM events WHERE event_type='contact_declined')::int AS contact_declined,
       (SELECT count(*) FROM events WHERE event_type='crm_submit_failed')::int AS crm_failed`, [reportDate, TZ]);
  const { rows: projects } = await db.query(
    `SELECT coalesce(project,'Sin definir') project, count(*)::int total FROM lead_bot_sessions
     WHERE started_at >= ($1::date::timestamp AT TIME ZONE $2)
       AND started_at < (($1::date + 1)::timestamp AT TIME ZONE $2)
     GROUP BY project ORDER BY total DESC LIMIT 8`, [reportDate, TZ]);

  const projectRows = projects.map((p) => `<tr><td>${escapeHtml(p.project)}</td><td>${p.total}</td></tr>`).join("");
  const html = `<h1>Resumen diario del bot — ${reportDate}</h1>
    <ul><li>${metrics.sessions} sesiones iniciadas</li><li>${metrics.conversations} conversaciones</li>
    <li>${metrics.messages} mensajes totales</li><li>${metrics.contacts} contactos capturados</li>
    <li>${metrics.crm_submitted} leads enviados al CRM</li><li>${metrics.whatsapp_clicked} clics en WhatsApp</li>
    <li>${metrics.contact_declined} rechazos de contacto</li><li>${metrics.crm_failed} errores de CRM</li></ul>
    <h2>Interés por proyecto</h2><table cellpadding="6" border="1"><tr><th>Proyecto</th><th>Sesiones</th></tr>${projectRows}</table>`;

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
  });
  const info = await transporter.sendMail({
    from: process.env.LEAD_BOT_REPORT_FROM || process.env.SMTP_USER,
    to: process.env.LEAD_BOT_REPORT_TO || "homes@coradir.com.ar",
    subject: `Resumen diario Bot Homes — ${reportDate}`, html,
  });
  return { date: reportDate, metrics, messageId: info.messageId };
}

function escapeHtml(value: string) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
}
