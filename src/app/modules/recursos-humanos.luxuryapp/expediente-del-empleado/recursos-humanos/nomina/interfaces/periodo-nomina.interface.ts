export interface PeriodoNominaDTO {
  id: string;
  customerId: string;
  nombreCliente: string;
  quincena: number;
  quincenaDisplay: string;
  mes: number;
  anio: number;
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string | null;
  diasHabiles: number;
  estado: string;
  totalNominas: number;
}

export interface PeriodoNominaCreateDTO {
  customerId: string;
  quincena: number;
  mes: number;
  anio: number;
  fechaPago?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface PeriodoNominaUpdateDTO {
  fechaPago?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface DiasNoHabilesDTO {
  id: string;
  periodoNominaId: string;
  fecha: string;
  descripcion: string;
  esFestivoOficial: boolean;
}

export interface DiasNoHabilesCreateDTO {
  fecha: string;
  descripcion: string;
  esFestivoOficial: boolean;
}

export const QUINCENA_OPTIONS = [
  { label: "Primera Quincena",  value: 1 },
  { label: "Segunda Quincena", value: 2 },
];

export const MES_OPTIONS = [
  { label: "Enero",      value: 1 },
  { label: "Febrero",    value: 2 },
  { label: "Marzo",      value: 3 },
  { label: "Abril",      value: 4 },
  { label: "Mayo",       value: 5 },
  { label: "Junio",      value: 6 },
  { label: "Julio",      value: 7 },
  { label: "Agosto",     value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre",    value: 10 },
  { label: "Noviembre",  value: 11 },
  { label: "Diciembre",  value: 12 },
];
