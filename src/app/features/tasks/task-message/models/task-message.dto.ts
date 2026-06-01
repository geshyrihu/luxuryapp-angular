import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
export interface ITaskMessageDTO {
  id: string;
  ticketGroupId: string;
  folio: string;
  title: string;
  meetingId: string | null;
  serviceOrderId: string | null;
  createdAtDate: string;
  createdAtHour: string;
  createdAtFilter: Date;
  closedAt: string | null;
  closedAtFilter: boolean;
  scheduledAt: string | null;
  scheduledAtFilter: boolean;
  description: string;
  priority: string;
  status: string;
  isRelevant: boolean;
  creator: string | null;
  creatorId: string | null;
  daysDifference: string | null;
  creatorImg: string | null;
  assignee: string | null;
  assigneeId: string | null;
  assigneeImg: string | null;
  closedBy: string | null;
  afterWork: string | null;
  beforeWork: string | null;
  ticketMessageFollowUp: number;
  ticketGroupMessageRead: number;
  dependsOnTaskId: string | null;
  dependsOnTaskFolio: string | null;
  lastFollowUp: string | null;
  actualStartDate: string | null;
  parentTaskId: string | null;
  hasSubTasks: boolean;
}

export interface ITaskResultDTO {
  nameGroup: string;
  totalRecords: number;
  assignee: ISelectItem[];
  items: ITaskMessageDTO[];
}
