import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DateService } from "src/app/core/services/date.service";

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
  googleStatus: string;
  juntaMensualSessionId: string | null;
  hasAssemblyChecklist: boolean;
  isSynchronized: boolean;
  isRecurring: boolean;
  recurrenceSummary: string;
}

@Component({
  selector: "app-google-calendar-detail",
  templateUrl: "./google-calendar-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabel],
})
export class GoogleCalendarDetail {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly dateS = inject(DateService);

  readonly item = this.config.data.item as IGoogleCalendarEventListItem;

  onClose() {
    this.ref.close(false);
  }

  formatBusinessDateTime(value: string | Date | null | undefined) {
    const parsed = this.parseBusinessDateTime(value);
    if (!parsed) return "";

    const day = `${parsed.getDate()}`.padStart(2, "0");
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const year = parsed.getFullYear();
    const hours = `${parsed.getHours()}`.padStart(2, "0");
    const minutes = `${parsed.getMinutes()}`.padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  getStatusLabel() {
    if (this.item.isSynchronized) {
      return "Sincronizado con Google";
    }

    const normalizedStatus = (this.item.googleStatus || "")
      .trim()
      .toLowerCase();
    if (
      normalizedStatus === "historicolocal" ||
      normalizedStatus === "historico local"
    ) {
      return "Solo local (historico)";
    }

    const startAt = this.parseBusinessDateTime(this.item.startAt);
    if (startAt && startAt.getTime() < Date.now()) {
      return "Solo local";
    }

    return "Pendiente de sincronizar";
  }

  private parseBusinessDateTime(value: string | Date | null | undefined) {
    if (!value) return null;

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? null : value;
    }

    const normalized = `${value}`.trim();
    const match = normalized.match(
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/,
    );

    if (match) {
      const [, year, month, day, hour, minute, second] = match;
      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second ?? "0"),
      );
    }

    return this.dateS.parseDate(normalized) ?? null;
  }
}
