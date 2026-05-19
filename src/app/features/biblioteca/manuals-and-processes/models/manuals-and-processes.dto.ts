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
  responsableRoleId: string | null;
  responsableRoleNombre: string | null;
  /** 0=Normal 1=Nota 2=Advertencia 3=BuenasPracticas */
  tipoNota: number;
  isActive: boolean;
  diagramaId: string | null;
  diagramaXml: string | null;
  imagenes: IManualPasoImagenDTO[];
}

export interface IManualPasoAddDTO {
  titulo: string;
  descripcion: string | null;
  responsableRoleId: string | null;
  /** 0=Normal 1=Nota 2=Advertencia 3=BuenasPracticas */
  tipoNota: number;
  orden: number;
}

export interface IManualPasoEditDTO extends IManualPasoAddDTO {}

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
}

export interface IManualTemplateEditDTO extends IManualTemplateAddDTO {}

// ----------------------------------------------------------------
// LEGACY INTERFACES (api/manuals/templates — do not remove)
// ----------------------------------------------------------------

export interface IManualTemplateDTO {
  id: string;
  folio: string;
  description: string;
  departament: number;
  departamentName?: string;
  documentType: number;
  documentTypeName?: string;
  confidentialityLevel: number;
  confidentialityLevelName?: string;
  uploadDate: string;
  currentVersion: string;
  isGlobal: boolean;
  isActive: boolean;
  targetRoleIds: string[];
  targetCustomerIds: string[];
  items: IManualTemplateItemDTO[];
  versions: IManualTemplateVersionDTO[];
  attachments: IManualTemplateAttachmentDTO[];
}

export interface IManualTemplateAttachmentDTO {
  id: string;
  manualTemplateId: string;
  name: string;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  fileUrl: string;
}

export interface IManualTemplateVersionDTO {
  id: string;
  version: string;
  changeDate: string;
  author: string;
  reviewedBy: string;
  approvedBy: string;
  changeDescription: string;
}

export interface IManualTemplateItemDTO {
  id: string;
  title: string;
  description: string;
  entityType: string;
  entityFilter: string | null;
  sortOrder: number;
  isActive: boolean;
  sectionType: ESectionType;
  contentJson: string | null;
  alertType: EAlertType | null;
  manualFlowchartId: string | null;
  flowchartName: string | null;
  flowchartContent: string | null;
}

export interface IManualFlowchartDTO {
  id: string;
  manualTemplateItemId: string;
  name: string;
  content: string;
  updatedAt: string;
}

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

export interface IManualInstanceDTO {
  id: string;
  manualTemplateId: string;
  templateName: string;
  customerId: string | null;
  name: string;
  folio: string;
  filePath: string;
  status: number;
  generatedBy: string;
  generatedAt: string;
}

export enum EManualInstanceStatus {
  Draft = 0,
  Generated = 1,
  Uploaded = 2,
  Approved = 3,
  Published = 4,
  Archived = 5,
}
