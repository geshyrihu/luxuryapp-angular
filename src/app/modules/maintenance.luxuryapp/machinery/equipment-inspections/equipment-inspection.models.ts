export type EquipmentInspectionRecurrenceUnit = 1 | 2 | 3;
export type EquipmentInspectionSeverity = 1 | 2 | 3;

export interface EquipmentInspectionDefinitionListDTO {
  id: string;
  machineryId: string;
  machineryName: string;
  name: string;
  isActive: boolean;
  recurrenceUnit: EquipmentInspectionRecurrenceUnit;
  recurrenceInterval: number;
  dayOfMonth: number | null;
  criteriaCount: number;
  assigneesCount: number;
}

export interface EquipmentInspectionDefinitionDTO {
  id: string;
  customerId: string;
  machineryId: string;
  machineryName: string;
  name: string;
  description: string | null;
  isActive: boolean;
  recurrenceUnit: EquipmentInspectionRecurrenceUnit;
  recurrenceInterval: number;
  dayOfMonth: number | null;
  estimatedDurationMinutes: number | null;
  createdAt: string;
  createdByUserId: string;
  createdByUserName: string;
  assignees: EquipmentInspectionDefinitionAssigneeDTO[];
  weekDays: number[];
  criteria: EquipmentInspectionCriterionDTO[];
}

export interface EquipmentInspectionDefinitionAssigneeDTO {
  applicationUserId: string;
  fullName: string;
  isPrimary: boolean;
}

export interface EquipmentInspectionCriterionDTO {
  id: string;
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface EquipmentInspectionDefinitionAddOrEditDTO {
  customerId: string;
  machineryId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  recurrenceUnit: EquipmentInspectionRecurrenceUnit;
  recurrenceInterval: number;
  dayOfMonth: number | null;
  estimatedDurationMinutes: number | null;
  createdByUserId: string;
  assignees: EquipmentInspectionDefinitionAssigneeInputDTO[];
  weekDays: number[];
  criteria: EquipmentInspectionCriterionInputDTO[];
}

export interface EquipmentInspectionDefinitionAssigneeInputDTO {
  applicationUserId: string;
  isPrimary: boolean;
}

export interface EquipmentInspectionCriterionInputDTO {
  title: string;
  description: string | null;
  position: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface EquipmentInspectionExecutionListDTO {
  id: string;
  machineryId: string;
  machineryName: string;
  equipmentInspectionDefinitionId: string;
  definitionName: string;
  assignedToUserId: string | null;
  assignedToUserName: string | null;
  status: number;
  severity: EquipmentInspectionSeverity | null;
  executionDate: string;
  isClosed: boolean;
  pendingItemsCount: number;
  totalItemsCount: number;
}

export interface EquipmentInspectionExecutionDTO {
  id: string;
  customerId: string;
  machineryId: string;
  machineryName: string;
  equipmentInspectionDefinitionId: string;
  definitionName: string;
  assignedToUserId: string | null;
  assignedToUserName: string | null;
  executedByUserId: string | null;
  executedByUserName: string | null;
  status: number;
  severity: EquipmentInspectionSeverity | null;
  observations: string | null;
  executionDate: string;
  startedAt: string | null;
  completedAt: string | null;
  isClosed: boolean;
  administrativeModificationCount: number;
  administrativeModificationReason: string | null;
  generatedFromQrLabelId: string | null;
}

export interface EquipmentInspectionExecutionDetailDTO
  extends EquipmentInspectionExecutionDTO {
  qrLabelCode: string | null;
  items: EquipmentInspectionExecutionItemDTO[];
  images: EquipmentInspectionExecutionImageDTO[];
  serviceOrderIds: string[];
}

export interface EquipmentInspectionExecutionItemDTO {
  id: string;
  equipmentInspectionCriterionId: string;
  criterionTitle: string;
  criterionDescription: string | null;
  position: number;
  isRequired: boolean;
  isCompliant: boolean;
  observation: string | null;
}

export interface EquipmentInspectionExecutionImageDTO {
  id: string;
  imagePath: string;
  caption: string | null;
  position: number;
  uploadedAt: string;
  uploadedByUserId: string;
  uploadedByUserName: string | null;
}

export interface EquipmentInspectionExecutionCompleteDTO {
  severity: EquipmentInspectionSeverity;
  observations: string | null;
  items: EquipmentInspectionExecutionItemInputDTO[];
  images: EquipmentInspectionExecutionImageInputDTO[];
}

export interface EquipmentInspectionExecutionAdministrativeUpdateDTO
  extends EquipmentInspectionExecutionCompleteDTO {
  reason: string;
}

export interface EquipmentInspectionExecutionItemInputDTO {
  equipmentInspectionCriterionId: string;
  isCompliant: boolean;
  observation: string | null;
}

export interface EquipmentInspectionExecutionImageInputDTO {
  imagePath: string;
  caption: string | null;
  position: number;
}

export interface EquipmentInspectionExecutionStartFromQrDTO {
  customerId: string;
  code: string;
  definitionId: string | null;
}

export type EquipmentInspectionQrType = 1 | 2 | 3;

export interface EquipmentQrLabelListDTO {
  id: string;
  machineryId: string;
  machineryName: string;
  code: string;
  name: string;
  qrType: EquipmentInspectionQrType;
  qrTypeName: string;
  deepLink: string;
  isActive: boolean;
  printedAt: string | null;
}

export interface EquipmentQrLabelDTO extends EquipmentQrLabelListDTO {
  customerId: string;
  printedByUserId: string | null;
  printedByUserName: string | null;
  notes: string | null;
  createdAt: string;
}

export interface EquipmentQrLabelAddOrEditDTO {
  customerId: string;
  machineryId: string;
  name: string;
  qrType: EquipmentInspectionQrType;
  isActive: boolean;
  notes: string | null;
}

export interface EquipmentQrBatchDownloadDTO {
  customerId: string;
  machineryIds: string[];
  qrLabelIds: string[];
  onlyActive: boolean;
}

export interface EquipmentQrDownloadItemDTO {
  qrLabelId: string;
  customerId: string;
  machineryId: string;
  machineryName: string;
  machineryLocation: string | null;
  labelName: string;
  code: string;
  deepLink: string;
  qrText: string;
  qrTypeName: string;
  labelWidthMm: number;
  labelHeightMm: number;
}

export interface EquipmentQrResolveDTO {
  customerId: string;
  machineryId: string;
  machineryName: string;
  machineryLocation: string | null;
  qrLabelId: string;
  qrLabelName: string;
  code: string;
  qrType: EquipmentInspectionQrType;
  qrTypeName: string;
  deepLink: string;
  suggestedDefinitionId: string | null;
  suggestedDefinitionName: string | null;
  hasPendingExecution: boolean;
  pendingExecutionId: string | null;
}
