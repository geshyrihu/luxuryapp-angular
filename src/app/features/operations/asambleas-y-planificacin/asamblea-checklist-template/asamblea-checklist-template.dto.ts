export interface IAsambleaChecklistTemplateDTO {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  offsetDaysFromMeeting: number;
  defaultResponsibleRole: string;
  isMandatory: boolean;
  isActive: boolean;
  sortOrder: number;
  version: number;
}

export interface IAsambleaChecklistTemplateAddOrEditDTO {
  code: string;
  title: string;
  category: string;
  description: string;
  offsetDaysFromMeeting: number;
  defaultResponsibleRole: string;
  isMandatory: boolean;
  isActive: boolean;
  sortOrder: number;
}
