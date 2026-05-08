export interface PendingItemDTO {
  id: string;
  module: string; // "Tickets", "Minutas", "Mantenimiento", etc.
  title: string;
  description: string;
  status: string;
  date: string; // ISO string
  formattedDate: string;
  responsible: string;
  urlRoute: string; // Frontend route
  priority: number;
  lastFollowup?: string;
  lastFollowupDate?: string | Date; // Date from backend comes as string usually unless mapped
  metadata?: { [key: string]: string };
  daysOpen?: number;
}









