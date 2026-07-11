export interface LogEntry {
  id: number;
  message: string;
  messageTemplate: string;
  level: string;
  timestamp: string;
  exception: string;
  properties: string;
  userName: string;
  expanded?: boolean;
}
