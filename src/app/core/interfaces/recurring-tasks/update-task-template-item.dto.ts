import { TaskPriority } from './task-priority.enum';
export interface UpdateTaskTemplateItemDto {
  title: string;
  description: string;
  priority: TaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isActive: boolean;
}









