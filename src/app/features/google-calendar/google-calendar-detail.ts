import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";

interface IGoogleCalendarEventListItem {
  id: string;
  customerId: string;
  title: string;
  subjectTypeName: string;
  modalityName: string;
  startAt: string;
  endAt: string;
  location: string;
  guestCount: number;
  googleHtmlLink: string;
  googleMeetUrl: string;
  isSynchronized: boolean;
  isRecurring: boolean;
  recurrenceSummary: string;
}

@Component({
  selector: "app-google-calendar-detail",
  templateUrl: "./google-calendar-detail.html",
  imports: [CommonModule, DatePipe],
})
export class GoogleCalendarDetail {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly item = this.config.data.item as IGoogleCalendarEventListItem;

  onClose() {
    this.ref.close(false);
  }
}
