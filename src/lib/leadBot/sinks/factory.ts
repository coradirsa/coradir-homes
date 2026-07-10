import { HomesCrmLeadSink } from "./homesCrm";
import { N8nLeadSink } from "./n8n";
import type { LeadSink, LeadSinkSubmitInput, LeadSinkSubmitResult } from "./types";

function hasN8nFallback() {
  return Boolean(process.env.N8N_LEAD_BOT_WEBHOOK_URL);
}

export function createLeadSink(): LeadSink {
  const provider = (process.env.LEAD_BOT_INTEGRATION_PROVIDER || "homes-crm").toLowerCase();

  if (provider === "n8n") {
    return new N8nLeadSink();
  }

  return new HomesCrmLeadSink();
}

export async function submitLeadToConfiguredSink(input: LeadSinkSubmitInput): Promise<LeadSinkSubmitResult> {
  const primary = createLeadSink();
  const result = await primary.submit(input);

  if (!result.skipped || !hasN8nFallback()) {
    return result;
  }

  return new N8nLeadSink().submit(input);
}
