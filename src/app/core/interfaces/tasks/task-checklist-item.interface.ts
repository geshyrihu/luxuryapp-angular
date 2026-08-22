export interface TaskChecklistItemInterface {
  id: string;
  tasksId: string;
  description: string;
  isDone: boolean;
  doneByUserId: string | null;
  doneByUserName: string | null;
  doneAt: string | null;
}
