export interface IMeetingIndex {
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
  contable: IMeetingDetail[];
  operaciones: IMeetingDetail[];
  legal: IMeetingDetail[];
}

export interface IMeetingDetail {
  id: string;
  meetingId: string;
  status: number;
  requestService: string;
  deliveryDateFilter: string;
  deliveryDate: string;
  title: string;
  seguimiento: ISeguimiento[];
}

export interface ISeguimiento {
  id: string;
  fechaOrden: string;
  fecha: string;
  seguimiento: string;
}









