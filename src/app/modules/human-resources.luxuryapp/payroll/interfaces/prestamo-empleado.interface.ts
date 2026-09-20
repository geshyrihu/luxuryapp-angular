export interface PrestamoEmpleadoDTO {
  id: string;
  employeeId: string;
  nombreEmpleado: string;
  customerId: string;
  montoTotal: number;
  montoAmortizacion: number;
  numeroPagos: number;
  pagosPendientes: number;
  pagosRealizados: number;
  saldoPendiente: number;
  montoAmortizado: number;
  estado: string;
  estadoValue: number;
  fechaSolicitud: string;
  fechaAutorizacion: string | null;
  aprobadoPor: string | null;
  motivo: string;
  observaciones: string;
}

export interface PrestamoEmpleadoCreateDTO {
  employeeId: string;
  customerId: string;
  montoTotal: number;
  numeroPagos: number;
  motivo: string;
  observaciones?: string;
}

export interface PrestamoEmpleadoDecisionDTO {
  observaciones: string;
}

export interface PagoPrestamoDTO {
  id: string;
  prestamoEmpleadoId: string;
  nominaDetalleId: string;
  montoPagado: number;
  numeroPago: number;
  fechaPago: string;
}

export interface TablaAmortizacionDTO {
  numeroPago: number;
  fechaEstimada: string;
  montoAmortizacion: number;
  saldoAntes: number;
  saldoDespues: number;
  pagado: boolean;
  fechaPagoReal: string | null;
}

export const NUMERO_PAGOS_OPTIONS = [
  { label: "1 quincena",  value: 1 },
  { label: "2 quincenas", value: 2 },
  { label: "3 quincenas", value: 3 },
  { label: "4 quincenas", value: 4 },
  { label: "5 quincenas", value: 5 },
  { label: "6 quincenas", value: 6 },
  { label: "8 quincenas", value: 8 },
  { label: "10 quincenas", value: 10 },
  { label: "12 quincenas", value: 12 },
];
