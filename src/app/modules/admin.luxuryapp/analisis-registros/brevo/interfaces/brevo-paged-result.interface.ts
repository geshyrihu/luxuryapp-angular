import { BrevoEmailLogDto } from "./brevo-email-log.interface";

export interface BrevoPagedResultDto {
  totalCount: number;
  items: BrevoEmailLogDto[];
}
