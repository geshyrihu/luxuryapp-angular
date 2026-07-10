export interface AgendaSemanalEventDTO {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  subjectTypeName: string;
  modalityName: string;
  startAt: string;
  endAt: string;
  location: string;
  googleMeetUrl: string;
  googleHtmlLink: string;
  guestCount: number;
  isRecurring: boolean;
}

export interface AgendaDiaGroup {
  label: string;
  fecha: Date;
  esHoy: boolean;
  eventos: AgendaSemanalEventDTO[];
}
