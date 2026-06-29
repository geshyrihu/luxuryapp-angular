export interface HojaIncidenciasDTO {
  periodoNominaId: string;
  periodoDescripcion: string;
  fechaInicio: string;
  fechaFin: string;
  dias: DiaColumnaDTO[];
  empleados: EmpleadoHojaDTO[];
}

export interface DiaColumnaDTO {
  fecha: string;
  diaSemana: string;
  numeroDia: number;
  esDescanso: boolean;
  esFestivo: boolean;
  descripcionDia?: string;
}

export interface EmpleadoHojaDTO {
  employeeId: string;
  nombreCompleto: string;
  puesto: string;
  celdas: CeldaHojaDTO[];
  diasAPagar: number;
  countPD: number;
  countDF: number;
  countFaltas: number;
  countRetardos: number;
  countVacaciones: number;
  countIncapacidad: number;
  countPermiso: number;
}

export interface CeldaHojaDTO {
  fecha: string;
  status: StatusHoja;
  incidenciaId?: string;
  esSincronizada: boolean;
  minutosRetardo?: number;
}

export interface GuardarHojaIncidenciasDTO {
  periodoNominaId: string;
  celdas: CeldaGuardarDTO[];
}

export interface CeldaGuardarDTO {
  employeeId: string;
  fecha: string;
  status: StatusHoja;
  minutosRetardo?: number;
  observaciones?: string;
}

export type StatusHoja = 'A' | 'D' | 'DF' | 'PD' | 'F' | 'RE' | 'VA' | 'IN' | 'PE' | 'SA' | 'EC';

export const STATUS_CONFIG: Record<StatusHoja, { label: string; color: string; bgClass: string; textClass: string }> = {
  A:  { label: 'Asistencia',     color: '#16a34a', bgClass: 'bg-green-100',  textClass: 'text-green-800'  },
  D:  { label: 'Descanso',       color: '#94a3b8', bgClass: 'bg-slate-100',  textClass: 'text-slate-600'  },
  DF: { label: 'Día Festivo',    color: '#0369a1', bgClass: 'bg-blue-100',   textClass: 'text-blue-800'   },
  PD: { label: 'Prima Dom.',     color: '#b45309', bgClass: 'bg-amber-100',  textClass: 'text-amber-800'  },
  F:  { label: 'Falta',          color: '#dc2626', bgClass: 'bg-red-100',    textClass: 'text-red-800'    },
  RE: { label: 'Retardo',        color: '#d97706', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800' },
  VA: { label: 'Vacación',       color: '#2563eb', bgClass: 'bg-indigo-100', textClass: 'text-indigo-800' },
  IN: { label: 'Incapacidad',    color: '#7c3aed', bgClass: 'bg-violet-100', textClass: 'text-violet-800' },
  PE: { label: 'Permiso c/G',    color: '#0891b2', bgClass: 'bg-cyan-100',   textClass: 'text-cyan-800'   },
  SA: { label: 'Permiso s/G',    color: '#9f1239', bgClass: 'bg-rose-100',   textClass: 'text-rose-800'   },
  EC: { label: 'Día Económico',  color: '#6b7280', bgClass: 'bg-gray-100',   textClass: 'text-gray-700'   },
};

export const STATUS_ORDEN_CICLO: StatusHoja[] = ['A', 'F', 'RE', 'VA', 'IN', 'PE', 'SA', 'EC', 'PD', 'D', 'DF'];
