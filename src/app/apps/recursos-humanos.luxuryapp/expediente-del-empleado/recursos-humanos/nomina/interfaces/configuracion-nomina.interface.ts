export interface ConfiguracionNominaDTO {
  id: string;
  customerId: string;
  frecuenciaPago: number;
  frecuenciaPagoDisplay: string;
  diaPago1: number;
  diaPago2: number;
  diasAguinaldo: number;
  factorPrimaVacacional: number;
  minutosToleranciaRetardo: number;
  retardosPorFalta: number;
  porcentajeEnfermedadMaternidad: number;
  porcentajeIvcm: number;
  porcentajeCesantiaVejez: number;
}

export interface ConfiguracionNominaUpdateDTO {
  frecuenciaPago: number;
  diaPago1: number;
  diaPago2: number;
  diasAguinaldo: number;
  factorPrimaVacacional: number;
  minutosToleranciaRetardo: number;
  retardosPorFalta: number;
  porcentajeEnfermedadMaternidad: number;
  porcentajeIvcm: number;
  porcentajeCesantiaVejez: number;
}

export const FRECUENCIA_PAGO_OPTIONS = [
  { label: "Quincenal", value: 0 },
  { label: "Semanal",   value: 1 },
  { label: "Mensual",   value: 2 },
];
