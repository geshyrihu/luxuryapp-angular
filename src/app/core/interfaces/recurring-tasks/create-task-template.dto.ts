import { TaskPriority } from './task-priority.enum';
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
  priority: TaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isActive: boolean;
}









