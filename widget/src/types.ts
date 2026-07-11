export type SurveyReasonDTO = { id: string; label: string };

export type OfferDTO = {
  id: string;
  type: "discount" | "pause";
  headline: string;
  percentOff: number | null;
  durationMonths: number | null;
  pauseMonths: number | null;
};

export type ConfigResponse = {
  projectId: string;
  accentColor: string;
  poweredByBadge: boolean;
  reasons: SurveyReasonDTO[];
  offers: OfferDTO[];
};

export type CreateSessionResponse = {
  sessionId: string;
  sessionToken: string;
  offer: OfferDTO | null;
};

export type ContinueCancelContext = {
  customerId?: string;
  reasonId?: string;
};

export type OpenOptions = {
  customerId?: string;
  customerEmail?: string;
  onContinueCancel?: (ctx: ContinueCancelContext) => void;
};

export type InitOptions = {
  onContinueCancel?: OpenOptions["onContinueCancel"];
};
