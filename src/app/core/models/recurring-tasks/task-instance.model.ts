import { ETaskPriority, ETaskStatus } from "./enums.model";
import { TaskAttachment } from "./task-attachment.model";
import { TaskComment } from "./task-comment.model";
export interface TaskInstance {
  id: string;
  taskTemplateItemId: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  priority: ETaskPriority;
  priorityDescription: string;
  assigneeId: string;
  assigneeName: string;
  status: ETaskStatus;
  statusDescription: string;
  scheduledDate: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
}









