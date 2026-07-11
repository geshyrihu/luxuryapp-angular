import { TaskPriority } from './enums.model';
export interface UpdateTaskTemplateItemDto {
  title: string;
  description: string;
  priority: TaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isActive: boolean;
}









