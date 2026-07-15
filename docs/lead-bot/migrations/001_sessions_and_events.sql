CREATE TABLE IF NOT EXISTS lead_bot_sessions (
  client_id text PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  name text, email text, phone text, project text, intent text,
  classification text, score integer NOT NULL DEFAULT 0,
  wants_human_handoff boolean NOT NULL DEFAULT false,
  declined_contact boolean NOT NULL DEFAULT false,
  crm_submitted_at timestamptz, crm_lead_id text,
  tracking jsonb NOT NULL DEFAULT '{}'::jsonb,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  message_count integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS lead_bot_sessions_activity_idx ON lead_bot_sessions(last_activity_at);
CREATE TABLE IF NOT EXISTS lead_bot_events (
  id bigserial PRIMARY KEY,
  client_id text NOT NULL REFERENCES lead_bot_sessions(client_id) ON DELETE CASCADE,
  event_type text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS lead_bot_events_time_type_idx ON lead_bot_events(occurred_at,event_type);
