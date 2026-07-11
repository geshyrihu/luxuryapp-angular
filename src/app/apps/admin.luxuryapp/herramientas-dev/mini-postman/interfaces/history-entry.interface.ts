export interface HistoryEntry {
  method: string;
  url: string;
  statusCode: number;
  durationMs: number;
  timestamp: Date;
}
