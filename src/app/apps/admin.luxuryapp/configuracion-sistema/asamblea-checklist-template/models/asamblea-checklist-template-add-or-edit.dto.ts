export interface AsambleaChecklistTemplateAddOrEditDto {
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
