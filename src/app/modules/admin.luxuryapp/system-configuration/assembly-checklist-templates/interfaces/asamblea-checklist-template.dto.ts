export interface AsambleaChecklistTemplateDto {
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
