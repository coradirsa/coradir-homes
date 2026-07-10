import type { LeadSink, LeadSinkSubmitInput, LeadSinkSubmitResult } from "./types";

type N8nResponse = {
  success?: boolean;
  leadId?: string;
  id?: string;
  message?: string;
};

function getN8nConfig() {
  const webhookUrl = process.env.N8N_LEAD_BOT_WEBHOOK_URL;
  if (!webhookUrl) return null;
  return { webhookUrl };
}

function buildN8nPayload(input: LeadSinkSubmitInput) {
  const { state, qualification, conversion, tracking } = input;
  const latestUserMessage = [...state.messages].reverse().find((message) => message.role === "user");

  return {
    source: "chatbot_homes",
    action_type: `lead_${qualification.classification.toLowerCase()}`,
    user_data: {
      client_id: state.clientId,
      name: state.name,
      email: state.email,
      phone: state.phone,
    },
    qualification: {
      ...qualification,
      intent: state.intent,
      project: state.project,
      budgetStatus: state.budgetStatus,
      budgetText: state.budgetText,
      budgetCurrency: state.budgetCurrency,
      timeline: state.timeline,
      decisionRole: state.decisionRole,
    },
    conversion: {
      recommended_action: conversion.type,
      cta_shown: conversion.label,
      message: conversion.message,
    },
    conversation_data: {
      latest_user_message: latestUserMessage?.content,
      advisor_summary: state.advisorSummary,
      advisor_summary_generated_at: state.advisorSummaryGeneratedAt,
      messages: state.messages.slice(-8),
    },
    tracking: {
      ...tracking,
      timestamp: new Date().toISOString(),
    },
  };
}

export async function submitLeadToN8n(input: LeadSinkSubmitInput): Promise<LeadSinkSubmitResult> {
  const config = getN8nConfig();

  if (!config) {
    return {
      ok: false,
      skipped: true,
      error: "N8N_LEAD_BOT_WEBHOOK_URL no configurado.",
    };
  }

  const response = await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildN8nPayload(input)),
  });

  const data = (await response.json().catch(() => null)) as N8nResponse | null;

  if (!response.ok) {
    return {
      ok: false,
      skipped: false,
      error: data?.message || `N8N respondio ${response.status}`,
    };
  }

  return {
    ok: true,
    skipped: false,
    leadId: data?.leadId || data?.id,
  };
}

export class N8nLeadSink implements LeadSink {
  submit(input: LeadSinkSubmitInput) {
    return submitLeadToN8n(input);
  }
}
