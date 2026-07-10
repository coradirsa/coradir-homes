import type { DecisionRole, LeadBotState, LeadIntent, LeadTimeline, QualificationResult } from "./types";

const SQL_SCORE_THRESHOLD = 70;
const MQL_SCORE_THRESHOLD = 40;

const isQualifiedIntent = (intent: LeadIntent) => intent === "comprar" || intent === "alquilar" || intent === "invertir";

const isShortTimeline = (timeline?: LeadTimeline) =>
  timeline === "inmediato" || timeline === "0-3_meses" || timeline === "3-6_meses";

const isDecisionMaker = (role?: DecisionRole) => role === "decisor" || role === "influenciador";

export function scoreLead(state: LeadBotState): QualificationResult {
  const reasons: string[] = [];
  const missingFields: string[] = [];
  let score = 0;

  if (isQualifiedIntent(state.intent)) {
    score += 15;
    reasons.push("Intencion comercial clara.");
  } else {
    missingFields.push("intent");
  }

  if (state.project) {
    score += 10;
    reasons.push("Proyecto o interes identificado.");
  } else {
    missingFields.push("project");
  }

  if (state.budgetStatus === "definido" || state.budgetStatus === "credito") {
    score += 25;
    reasons.push("Capacidad economica o credito declarado.");
    if (state.needsBudgetCurrency) {
      missingFields.push("budgetCurrency");
    }
  } else if (state.budgetStatus === "sin_capacidad") {
    reasons.push("Declara no tener capacidad economica actual.");
  } else {
    missingFields.push("budget");
  }

  if (isShortTimeline(state.timeline)) {
    score += 20;
    reasons.push("Plazo de decision dentro de 6 meses.");
  } else if (state.timeline === "mas_6_meses") {
    score += 5;
    reasons.push("Plazo de decision largo.");
  } else {
    missingFields.push("timeline");
  }

  if (isDecisionMaker(state.decisionRole)) {
    score += 15;
    reasons.push("Participa en la decision.");
  } else if (state.decisionRole === "tercero") {
    score += 5;
    reasons.push("Consulta para otra persona.");
  } else {
    missingFields.push("decisionRole");
  }

  if (state.name && (state.email || state.phone)) {
    score += 10;
    reasons.push("Tiene nombre y contacto valido para seguimiento.");
  } else {
    missingFields.push("contact");
  }

  const classification =
    score >= SQL_SCORE_THRESHOLD &&
    isQualifiedIntent(state.intent) &&
    isShortTimeline(state.timeline) &&
    isDecisionMaker(state.decisionRole)
      ? "SQL"
      : score >= MQL_SCORE_THRESHOLD
        ? "MQL"
        : "NURTURE";

  return {
    score,
    classification,
    reasons,
    missingFields,
  };
}

export function getNextMissingField(state: LeadBotState): string | null {
  if (state.needsBudgetCurrency && !state.budgetCurrency && state.missingFields.includes("budgetCurrency")) {
    return "budgetCurrency";
  }

  if (state.budgetStatus === "sin_capacidad") {
    return state.missingFields.includes("contact") ? "contact" : null;
  }

  if ((state.name || state.email || state.phone || state.wantsHumanHandoff) && state.missingFields.includes("contact")) {
    return "contact";
  }

  if ((state.classification === "SQL" || state.wantsHumanHandoff) && !state.missingFields.includes("contact")) {
    return null;
  }

  const orderedFields = ["intent", "project", "budget", "budgetCurrency", "timeline", "decisionRole", "contact"];
  return orderedFields.find((field) => state.missingFields.includes(field)) || null;
}
