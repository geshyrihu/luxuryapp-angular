import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-ticket-legal-reportes-externos-mobile",
  templateUrl: "./ticket-legal-reportes-externos-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    LxIcon,
    DataViewMobile,
    LxEmptyState,
    MobileListItem,
    LxTag],
})
export class TicketLegalReportesExternosMobile {
  reportData = input<any>(null);
  requestsAttended = input.required<any[]>();
  requestsPending = input.required<any[]>();
}
