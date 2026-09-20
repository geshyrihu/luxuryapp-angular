// ----------------------------------------------------------------
// NEW SIMPLIFIED INTERFACES (api/manuals)
// ----------------------------------------------------------------

export interface IManualTemplateSimpleDTO {
  id: string;
  folio: string;
  description: string;
  objetivo: string;
  departament: string;
  currentVersion: string;
  marcoLegal: string | null;
  isGlobal: boolean;
  isActive: boolean;
  periodicity: number;
  periodicityName?: string;
  executionDaysOfWeek: number[];
  executionWeekOfMonth: number | null;
  executionDayOfMonth: number | null;
  executionMonthOfYear: number | null;
}

export interface IManualTemplateDetalleDTO extends IManualTemplateSimpleDTO {
  departamentValue: number;
  roleIds: string[];
  customerIds: string[];
  pasos: IManualPasoDTO[];
  adjuntos: IManualAdjuntoSimpleDTO[];
  versiones: IManualVersionSimpleDTO[];
}

export interface IManualPasoDTO {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string | null;
  responsableRoleIds: string[];
  responsableRoleNombres: string[];
  /** 0=Normal 1=Nota 2=Advertencia 3=BuenasPracticas */
  tipoNota: number;
  isActive: boolean;
  diagramaId: string | null;
  diagramaXml: string | null;
  imagenes: IManualPasoImagenDTO[];
  enlaces: IManualPasoEnlaceDTO[];
}

export interface IManualPasoAddDTO {
  titulo: string;
  descripcion: string | null;
  responsableRoleIds: string[];
  /** 0=Normal 1=Nota 2=Advertencia 3=BuenasPracticas */
  tipoNota: number;
  orden: number;
}

export interface IManualPasoEditDTO extends IManualPasoAddDTO {}

export interface IManualPasoEnlaceDTO {
  id: string;
  urlEnlace: string;
  esVideo: boolean;
  orden: number;
}

export interface IManualPasoEnlaceAddDTO {
  urlEnlace: string;
  esVideo: boolean;
}

export interface IManualPasoImagenDTO {
  id: string;
  url: string;
  orden: number;
}

export interface IManualAdjuntoSimpleDTO {
  id: string;
  nombre: string;
  url: string;
  fileExtension: string;
}

export interface IManualVersionSimpleDTO {
  id: string;
  version: string;
  fechaCambio: string;
  autor: string;
  descripcionCambio: string;
}

export interface IManualVersionAddDTO {
  version: string;
  fechaCambio: string;
  autor: string;
  descripcionCambio: string;
}

export interface IManualDiagramSimpleDTO {
  id: string;
  manualPasoId: string;
  nombre: string;
  xmlContent: string;
  actualizadoEn: string;
}

export interface IManualTemplateAddDTO {
  folio: string;
  description: string;
  objetivo: string;
  marcoLegal: string | null;
  departament: number;
  currentVersion: string;
  isGlobal: boolean;
  isActive: boolean;
  roleIds: string[];
  customerIds: string[];
  periodicity: number;
  executionDaysOfWeek: number[];
  executionWeekOfMonth: number | null;
  executionDayOfMonth: number | null;
  executionMonthOfYear: number | null;
}

export interface IManualTemplateEditDTO extends IManualTemplateAddDTO {}

// Legacy enums y types mantenidos por compatibilidad con datos historicos en BD (section-content.models.ts)
export enum ESectionType {
  Objective = 0,
  Scope = 1,
  Glossary = 2,
  Raci = 3,
  Steps = 4,
  Alert = 5,
  Flowchart = 6,
  VersionHistory = 7,
  References = 8,
  Appendix = 9
}

export enum EAlertType {
  Warning = 0,
  Info = 1,
  BestPractice = 2
}
