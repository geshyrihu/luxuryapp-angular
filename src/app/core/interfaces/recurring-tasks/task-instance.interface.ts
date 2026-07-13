import { TaskPriority } from "./task-priority.enum";
import { TaskStatus } from "./task-status.enum";
import { TaskAttachment } from "./task-attachment.interface";
import { TaskComment } from "./task-comment.interface";
export interface TaskInstance {
  id: string;
  taskTemplateItemId: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  priority: TaskPriority;
  priorityDescription: string;
  assigneeId: string;
  assigneeName: string;
  status: TaskStatus;
  statusDescription: string;
  scheduledDate: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  comments: TaskComment[];
  attachments: TaskAttachment[];
}









