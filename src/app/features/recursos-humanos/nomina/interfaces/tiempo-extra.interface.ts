import { EvidenciaNominaDTO } from "./evidencia-nomina.interface";

export interface TiempoExtraDTO {
  id: string;
  employeeId: string;
  nombreEmpleado: string;
  periodoNominaId: string;
  fecha: string;
  horasSimples: number;
  horasDobles: number;
  importeHorasSimples: number;
  importeHorasDobles: number;
  totalImporte: number;
  aprobado: boolean;
  aprobadoPor: string | null;
  fechaAprobacion: string | null;
  observaciones: string;
  evidencias: EvidenciaNominaDTO[];
}

export interface TiempoExtraCreateDTO {
  employeeId: string;
  periodoNominaId: string;
  fecha: string;
  horasSimples: number;
  horasDobles: number;
  observaciones?: string;
}

export interface TiempoExtraUpdateDTO {
  fecha: string;
  horasSimples: number;
  horasDobles: number;
  observaciones?: string;
}

export interface TiempoExtraDecisionDTO {
  observaciones: string;
}
