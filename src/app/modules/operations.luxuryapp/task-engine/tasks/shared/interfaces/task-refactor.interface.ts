export interface TaskResponsible {
  id: string;
  tasksId: string;
  applicationUserId: string;
  applicationUser: string;
  isPrimary: boolean;
  assignedAt: string;
}

export interface TaskResponsibleAddPayload {
  applicationUserId: string;
}

export interface TaskAdditionalImage {
  id: string;
  tasksId: string;
  fileName: string;
  path: string;
  mimeType: string;
  sortOrder: number;
  createdAt: string;
  createdByName: string;
}

export interface TaskFollowUpEvidenceImage {
  id: string;
  taskFollowUpId: string;
  fileName: string;
  path: string;
  mimeType: string;
  sortOrder: number;
  createdAt: string;
  createdByName: string;
}

export interface TaskImageReorderPayload {
  imageIds: string[];
}

export interface TaskFollowUpItem {
  id: string;
  ticketMessageId: string;
  applicationUser: string;
  description: string;
  createAtFilter: string;
  createdAt: string;
}
