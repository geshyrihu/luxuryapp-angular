export interface TareaLegalItemDTO {
  id: string;
  folio: string;
  title: string;
  status: string;
  priority: string;
  esAltaPrioridad: boolean;
  diasPendiente: number;
  assigneeName: string;
  ultimoSeguimiento: string | null;
  ultimoSeguimientoFecha: string | null;
}

export interface TareaLegalCustomerGroupDTO {
  customerName: string;
  total: number;
  tareas: TareaLegalItemDTO[];
}

export interface TareasLegalResumenDTO {
  total: number;
  customers: TareaLegalCustomerGroupDTO[];
}
