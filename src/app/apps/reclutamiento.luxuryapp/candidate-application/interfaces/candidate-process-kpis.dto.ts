export interface FuenteKpiItem {
  fuente: string;
  totalPostulaciones: number;
  contratados: number;
  tasaConversion: number;
}

export interface CandidateProcessKpisDto {
  vacantesAbiertas: number;
  vacantesSinPostulacion: number;
  porcentajeVacantesConPostulacion: number;
  postulacionesActivas: number;
  postulacionesEnNuevo: number;
  postulacionesEnEspera: number;
  postulacionesEnEntrevistaOperaciones: number;
  postulacionesSeleccionadas: number;
  postulacionesAltaEnProceso: number;
  postulacionesContratadas: number;
  postulacionesRechazadasONoPresentadas: number;
  entrevistasOperacionesSinEntrevistador: number;
  entrevistasOperacionesPendientesAgenda: number;
  entrevistasOperacionesVencidas: number;
  entrevistasOperacionesAgendadas: number;
  entrevistasOperacionesConFeedback: number;
  postulacionesSinFeedbackEnEntrevista: number;
  promedioDiasHastaEntrevistaOperaciones: number | null;
  promedioDiasEnEtapaActual: number;
  tasaSeleccion: number;
  porFuente: FuenteKpiItem[];
  postulacionesUltimos7Dias: number;
  postulacionesUltimos30Dias: number;
  promedioDiasVacanteAPrimeraPostulacion: number | null;
  medianaDiasVacanteAPrimeraPostulacion: number | null;
  percentil90DiasVacanteAPrimeraPostulacion: number | null;
  vacantesConPostulacionEnSla: number;
  vacantesConPostulacion: number;
  porcentajeVacantesEnSla: number;
}
