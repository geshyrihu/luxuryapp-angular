export interface TareaLegalItemDto {
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

export interface TareaLegalCustomerGroupDto {
  customerName: string;
  total: number;
  tareas: TareaLegalItemDto[];
}

export interface TareasLegalResumenDto {
  total: number;
  customers: TareaLegalCustomerGroupDto[];
}
