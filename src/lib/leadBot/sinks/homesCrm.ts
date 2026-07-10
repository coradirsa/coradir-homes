import type { LeadSink, LeadSinkSubmitInput, LeadSinkSubmitResult } from "./types";

type HomesCrmResponse = {
  success: boolean;
  data?: {
    lead?: {
      id?: string;
    };
  };
  message?: string;
};

const priorityByClassification: Record<string, string> = {
  SQL: "alta",
  MQL: "media",
  NURTURE: "baja",
};

const statusByClassification: Record<string, string> = {
  SQL: "interesado",
  MQL: "nuevo",
  NURTURE: "nuevo",
};

function getCrmConfig() {
  const baseUrl = process.env.HOMES_CRM_BASE_URL?.replace(/\/+$/, "");
  const token = process.env.HOMES_CRM_WEBHOOK_TOKEN || process.env.HOMES_WEBHOOK_TOKEN;

  if (!baseUrl || !token) {
    return null;
  }

  return { baseUrl, token };
}

function buildSummary({ state, conversion }: LeadSinkSubmitInput) {
  const parts = [
    state.advisorSummary ? `Resumen para asesor:\n${state.advisorSummary}` : null,
    `Clasificacion: ${state.classification || "sin clasificar"} (${state.score}/100)`,
    state.intent !== "indefinido" ? `Intencion: ${state.intent}` : null,
    state.project ? `Proyecto: ${state.project}` : null,
    state.budgetStatus ? `Capacidad: ${state.budgetStatus}` : null,
    state.timeline ? `Plazo: ${state.timeline}` : null,
    state.decisionRole ? `Decision: ${state.decisionRole}` : null,
    `Accion recomendada: ${conversion.type}`,
  ].filter(Boolean);

  return parts.join("\n");
}

export async function submitLeadToHomesCrm(input: LeadSinkSubmitInput): Promise<LeadSinkSubmitResult> {
  const config = getCrmConfig();

  if (!config) {
    return {
      ok: false,
      skipped: true,
      error: "HOMES_CRM_BASE_URL o HOMES_CRM_WEBHOOK_TOKEN no configurados.",
    };
  }

  const { state, qualification, conversion, tracking } = input;
  const latestUserMessage = [...state.messages].reverse().find((message) => message.role === "user");
  const summary = buildSummary(input);
  const timestamp = new Date().toISOString();

  const payload = {
    providerEventId: `lead-bot:${state.clientId}`,
    name: state.name,
    email: state.email,
    phone: state.phone,
    interesting: state.project || state.intent || "homes",
    message: `${latestUserMessage?.content || "Lead generado desde bot Homes"}\n\n${summary}`,
    timestamp,
    source: "chatbot_homes",
    sourceDetail: tracking?.pathname || "chatbot_homes",
    transactionType: state.intent === "alquilar" ? "alquilar" : "comprar",
    profileType: state.intent === "invertir" ? "inversor" : "consumidor",
    prioridad: priorityByClassification[state.classification || "NURTURE"],
    estado: statusByClassification[state.classification || "NURTURE"],
    bot_status: conversion.type === "schedule_call" || conversion.type === "whatsapp_handoff" ? "asesor" : "bot",
    utmSource: tracking?.utmSource,
    utmMedium: tracking?.utmMedium,
    utmCampaign: tracking?.utmCampaign,
    rawPayload: {
      source: "chatbot_homes",
      clientId: state.clientId,
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
      conversion,
      tracking,
      conversationData: {
        summary,
        advisorSummary: state.advisorSummary,
        advisorSummaryGeneratedAt: state.advisorSummaryGeneratedAt,
        messages: state.messages.slice(-8),
      },
    },
  };

  const response = await fetch(`${config.baseUrl}/api/homes/ingest/web-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-homes-token": config.token,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as HomesCrmResponse | null;

  if (!response.ok) {
    return {
      ok: false,
      skipped: false,
      error: data?.message || `CRM respondio ${response.status}`,
    };
  }

  return {
    ok: true,
    skipped: false,
    leadId: data?.data?.lead?.id,
  };
}

export class HomesCrmLeadSink implements LeadSink {
  submit(input: LeadSinkSubmitInput) {
    return submitLeadToHomesCrm(input);
  }
}
