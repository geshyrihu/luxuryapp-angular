import { FormControl } from "@angular/forms";

export interface IMyITaskMessageDTOForm {
  id: FormControl<string | null>;
  ticketGroupId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<number>;
  creatorId: FormControl<string>;
  customerId: FormControl<string>;
  beforeWork: FormControl<File | null>;
  afterWork: FormControl<File | null>;
  beforeWorkPreview: FormControl<string | null>;
  afterWorkPreview: FormControl<string | null>;
  applicationUserId: FormControl<string>;
  assignee: FormControl<string | null>;
  assigneeId: FormControl<string | null>;
  scheduledDate: FormControl<Date | null>;
  closedDate: FormControl<Date | null>;
}









