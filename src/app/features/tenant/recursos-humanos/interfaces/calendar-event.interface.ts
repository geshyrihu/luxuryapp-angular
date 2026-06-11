export interface CalendarEventDTO {
  id: string;
  title: string;
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
  color?: string;
  allDay: boolean;
}









