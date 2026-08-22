export interface TaskJustificationInterface {
  id: string;
  tasksId: string;
  reason: string;
  requestedByUserId: string;
  requestedByUserName: string | null;
  approvedByUserId: string | null;
  approvedByUserName: string | null;
  state: number;
  requestedAt: string;
  resolvedAt: string | null;
}
