export interface BrevoEmailLogDto {
  messageId: string;
  email: string;
  subject: string;
  event: string;
  date: string;
  from: string;
  templateId: number | null;
  tags: string[];
}
