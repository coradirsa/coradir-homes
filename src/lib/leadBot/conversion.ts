import { getNextMissingField } from "./scoring";
import type { ConversionAction, LeadBotState } from "./types";

const CONTACT_SUMMARY_MESSAGE =
  "Si queres que un asesor retome la consulta, me dejas tu nombre y un email o numero de contacto? Asi le llega el resumen y no tenes que repetir todo.";

const FIELD_QUESTIONS: Record<string, string> = {
  intent: "Para orientarte bien, te pregunto algo clave: ¿estás pensando en comprar, alquilar, invertir o todavía estás mirando opciones?",
  project: "¿Tenés algo en mente o querés que te compare rápido las opciones principales?",
  budget: "Y sobre presupuesto, ¿ya tenés un rango o querés que primero veamos alternativas y formas de avanzar?",
  budgetCurrency: "Cuando decís ese rango, ¿hablás de pesos o de dólares?",
  timeline: "¿Esto es para ahora, para los próximos meses o estás investigando con más tiempo?",
  decisionRole: "¿La decisión la tomás vos o la van a ver con alguien más?",
  contact: "Para guardar la consulta, ¿me dejás tu nombre y un email o número de contacto? Con eso el equipo puede retomar el caso sin que repitas todo.",
};

function hasLeadContact(state: LeadBotState) {
  return Boolean(state.name && (state.email || state.phone));
}

export function getConversionAction(state: LeadBotState): ConversionAction {
  if ((state.classification === "SQL" || state.wantsHumanHandoff) && !hasLeadContact(state) && !state.declinedContact) {
    return {
      type: "request_contact",
      label: "Guardar consulta",
      message: CONTACT_SUMMARY_MESSAGE,
      shouldSubmitToCrm: false,
    };
  }

  if (state.classification === "SQL" || state.wantsHumanHandoff) {
    return {
      type: "whatsapp_handoff",
      label: "Hablar por WhatsApp",
      message:
        "Con lo que me contás ya tiene sentido hablar con un asesor. Te habilito WhatsApp para coordinar con una persona del equipo.",
      shouldSubmitToCrm: true,
    };
  }

  const nextField = getNextMissingField(state);

  if (nextField) {
    return {
      type: nextField === "contact" ? "request_contact" : "ask_next_question",
      label: nextField === "contact" ? "Guardar consulta" : "Responder",
      message: nextField === "contact" ? CONTACT_SUMMARY_MESSAGE : FIELD_QUESTIONS[nextField],
      shouldSubmitToCrm: false,
    };
  }

  if (state.classification === "MQL") {
    return {
      type: "email_nurture",
      label: "Recibir información",
      message:
        "Puedo seguir orientándote por acá y, si querés, dejarte también la opción de hablar con un asesor por WhatsApp.",
      shouldSubmitToCrm: hasLeadContact(state),
    };
  }

  return {
    type: "send_project_info",
    label: "Recibir información",
    message:
      "Te puedo orientar con opciones y, si querés, dejar tu nombre y un email o número para guardar la consulta y retomarla después.",
    shouldSubmitToCrm: hasLeadContact(state),
  };
}

export function buildAssistantReply(state: LeadBotState, action: ConversionAction) {
  if (action.type === "ask_next_question" || action.type === "request_contact") {
    return action.message;
  }

  return action.message;
}
