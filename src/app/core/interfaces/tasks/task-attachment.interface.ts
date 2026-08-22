export interface TaskAttachmentInterface {
  id: string;
  tasksId: string;
  recurringTemplateId: string | null;
  fileName: string;
  path: string;
  mimeType: string;
  createdAt: string;
  createdByName: string | null;
}
