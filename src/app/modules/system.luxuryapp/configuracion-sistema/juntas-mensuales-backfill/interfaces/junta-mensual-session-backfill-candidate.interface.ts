import { JuntaMensualSessionBackfillMatch } from "./junta-mensual-session-backfill-match.interface";

export interface JuntaMensualSessionBackfillCandidate {
  juntaMensualSessionId: string;
  customerId: string;
  customerName: string;
  customerShortName: string;
  sessionTitle: string;
  sessionTypeDisplayName: string;
  scheduledAt: string;
  statusDisplayName: string;
  hasPresentationLinked: boolean;
  hasMeetingLinked: boolean;
  suggestedPresentation: JuntaMensualSessionBackfillMatch | null;
  suggestedMeeting: JuntaMensualSessionBackfillMatch | null;
}
