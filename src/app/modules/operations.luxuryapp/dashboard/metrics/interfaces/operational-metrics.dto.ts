export interface OperationalMetricsDTO {
  pendientes: number;
  completadas: number;
  tiempoPromedioResolucionDias: number;
  distribucionPorTipo: Record<string, number>;
}
