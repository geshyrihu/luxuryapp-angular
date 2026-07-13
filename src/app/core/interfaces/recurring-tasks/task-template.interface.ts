import { TaskTemplateItem } from './task-template-item.interface';
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  roleId: string;
  roleName: string;
  isActive: boolean;
  items: TaskTemplateItem[];
}









