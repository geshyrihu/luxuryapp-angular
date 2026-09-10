export interface JuntaMensualSessionBackfillMatch {
  id: string;
  type: string;
  title: string;
  relevantDate: string | null;
  score: number;
  confidence: string;
  reasons: string[];
}
