import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LogEntry } from "../interfaces/log-entry.interface";

@Component({
  selector: "app-log-api-report-mobile",
  templateUrl: "./log-api-report-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    LxCard,
    LxTag,
    WebButtonLabel,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
})
export class LogApiReportMobile {
  data = input.required<LogEntry[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  globalFilterFields = input<string[]>([]);

  search = output<string>();
  loadMore = output<void>();

  getLevelSeverity(level: string): "success" | "info" | "warn" | "danger" {
    switch (level?.toLowerCase()) {
      case "information":
        return "info";
      case "warning":
        return "warn";
      case "error":
      case "critical":
        return "danger";
      default:
        return "info";
    }
  }
}
