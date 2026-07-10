import type { ConversionAction, LeadBotState, LeadBotTracking, QualificationResult } from "../types";

export type LeadSinkSubmitInput = {
  state: LeadBotState;
  qualification: QualificationResult;
  conversion: ConversionAction;
  tracking?: LeadBotTracking;
};

export type LeadSinkSubmitResult = {
  ok: boolean;
  skipped: boolean;
  leadId?: string;
  error?: string;
};

export type LeadSink = {
  submit(input: LeadSinkSubmitInput): Promise<LeadSinkSubmitResult>;
};
