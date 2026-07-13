import { TaskPriority } from './task-priority.enum';
export interface TaskTemplateItem {
  id: string;
  taskTemplateId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  recurrenceRule: string;
  timeWindowStart?: string; // Format "HH:mm:ss"
  timeWindowEnd?: string;   // Format "HH:mm:ss"
  isActive: boolean;
}









