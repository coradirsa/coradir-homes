export type LeadIntent = "comprar" | "alquilar" | "invertir" | "consultar" | "indefinido";

export type LeadClassification = "SQL" | "MQL" | "NURTURE";

export type LeadTimeline = "inmediato" | "0-3_meses" | "3-6_meses" | "mas_6_meses" | "indefinido";

export type DecisionRole = "decisor" | "influenciador" | "tercero" | "indefinido";

export type BudgetStatus = "definido" | "credito" | "indefinido" | "sin_capacidad";

export type LeadBotMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type LeadBotTracking = {
  pathname?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

export type KnowledgeSource = {
  id: string;
  title: string;
  sourcePath: string;
  sourceFilePath: string;
  pages: number[];
};

export type LeadBotState = {
  clientId: string;
  intent: LeadIntent;
  project?: string;
  // Ultimo proyecto derivado de la pagina donde el usuario escribio. Permite
  // detectar navegacion entre paginas de proyecto para actualizar `project`.
  lastPageProject?: string;
  budgetStatus?: BudgetStatus;
  budgetText?: string;
  budgetCurrency?: "ARS" | "USD";
  needsBudgetCurrency?: boolean;
  timeline?: LeadTimeline;
  decisionRole?: DecisionRole;
  name?: string;
  email?: string;
  phone?: string;
  wantsHumanHandoff?: boolean;
  wantsComplaintFollowup?: boolean;
  declinedContact?: boolean;
  messages: LeadBotMessage[];
  score: number;
  classification?: LeadClassification;
  missingFields: string[];
  crmSubmittedAt?: string;
  crmLeadId?: string;
  advisorSummary?: string;
  advisorSummaryGeneratedAt?: string;
};

export type QualificationResult = {
  score: number;
  classification: LeadClassification;
  reasons: string[];
  missingFields: string[];
};

export type ConversionActionType =
  | "ask_next_question"
  | "send_project_info"
  | "request_contact"
  | "schedule_call"
  | "email_nurture"
  | "whatsapp_handoff"
  | "download_brochure";

export type ConversionAction = {
  type: ConversionActionType;
  label: string;
  message: string;
  shouldSubmitToCrm: boolean;
};

export type LeadBotApiRequest = {
  clientId: string;
  message: string;
  state?: Partial<LeadBotState>;
  tracking?: LeadBotTracking;
};

export type LeadBotApiResponse = {
  reply: string;
  state: LeadBotState;
  classification: LeadClassification;
  score: number;
  nextAction: ConversionAction;
  events: Array<Record<string, unknown>>;
  knowledgeSources?: KnowledgeSource[];
  handoffUrl?: string;
};
