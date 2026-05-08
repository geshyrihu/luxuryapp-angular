import { ETaskPriority } from './enums.model';
export interface CreateTaskTemplateDto {
  name: string;
  description: string;
  roleId: string;
  isActive: boolean;
  items: CreateTaskTemplateItemDto[];
}

export interface CreateTaskTemplateItemDto {
  title: string;
  description: string;
  priority: ETaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isActive: boolean;
}









