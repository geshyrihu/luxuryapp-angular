export interface MeetingIndex {
  id: string;
  customerId: string;
  date: string;
  time?: string;
  dateFormat: string;
  timeFormat?: string;
  eTypeMeeting: string;
  issues: number;
  pending: number;
  concluidos: number;
  noAutorizado: number;
  contable: MeetingDetail[];
  operaciones: MeetingDetail[];
  legal: MeetingDetail[];
}

export interface MeetingDetail {
  id: string;
  meetingId: string;
  status: number;
  requestService: string;
  deliveryDateFilter: string;
  deliveryDate: string;
  title: string;
  seguimiento: Seguimiento[];
}

export interface Seguimiento {
  id: string;
  fechaOrden: string;
  fecha: string;
  seguimiento: string;
}









