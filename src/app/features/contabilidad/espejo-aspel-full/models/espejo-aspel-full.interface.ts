export interface IEspejoAspelFullResponseDTO {
  ejercicio: number;
  empresa: string;
  grupos: IEspejoGrupoDTO[];
}

export interface IEspejoGrupoDTO {
  codigo: string;
  nombre: string;
  cuentasNivel1: IEspejoCuentaNivel1DTO[];
  saldoInicial: number;
  totalesCargo: number[];
  totalesAbono: number[];
  totalesPresupuesto: number[];
}

export interface IEspejoCuentaNivel1DTO {
  numCta: string;
  nombre: string;
  nivel: number;
  naturaleza: string;
  subCuentas: IEspejoCuentaNivel2DTO[];
  saldoInicial: number;
  totalesCargo: number[];
  totalesAbono: number[];
  totalesPresupuesto: number[];
}

export interface IEspejoCuentaNivel2DTO {
  numCta: string;
  nombre: string;
  nivel: number;
  naturaleza: string;
  detalle: IEspejoCuentaNivel3DTO[];
  saldoInicial: number;
  totalesCargo: number[];
  totalesAbono: number[];
  totalesPresupuesto: number[];
}

export interface IEspejoCuentaNivel3DTO {
  numCta: string;
  nombre: string;
  nivel: number;
  naturaleza: string;
  saldoInicial: number;
  cargos: number[];
  abonos: number[];
  presupuesto: number[];
}

/** Fila aplanada para renderizar en p-table */
export interface IEspejoFilaTabla {
  numCta: string;
  nombre: string;
  nivel: 1 | 2 | 3 | 'grupo';
  naturaleza: string;
  esTotal: boolean;
  saldoInicial: number;
  cargos: number[];
  abonos: number[];
  presupuesto: number[];
  grupoCodigo: string;
  grupoNombre: string;
}
