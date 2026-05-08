import { ETaskPriority } from './enums.model';
export interface UpdateTaskTemplateItemDto {
  title: string;
  description: string;
  priority: ETaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isActive: boolean;
}









