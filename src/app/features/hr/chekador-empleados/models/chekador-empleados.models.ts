export interface IRegistroChecador {
  id: string;
  nombreEmpleado: string;
  tipo: string;
  fechaHora: string;
  ubicacion: string | null;
  distanciaMetros: number | null;
  fotoUrl: string | null;
  ipAddress: string | null;
  esAnomalia: boolean;
  tipoAnomalia: string | null;
  estadoAnomalia: string | null;
  notaAnomalia: string | null;
}

export interface IResumenAsistencia {
  totalMes: number;
  tasaPuntualidad: string;
  ultimoRegistro: string | null;
  estadoActual: string | null;
  registrosHoy: IRegistroChecador[];
}

export interface ISedeChecador {
  id: string;
  nombre: string;
  latitud: number;
  longitud: number;
  radioMetros: number;
  activa: boolean;
}

export interface ICrearSedeChecadorDTO {
  nombre: string;
  latitud: number;
  longitud: number;
  radioMetros: number;
}

export interface IAprobarRechazarAnomaliaDTO {
  nota: string | null;
}
