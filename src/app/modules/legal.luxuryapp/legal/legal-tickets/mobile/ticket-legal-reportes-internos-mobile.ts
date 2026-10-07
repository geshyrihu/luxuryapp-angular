import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-ticket-legal-reportes-internos-mobile",
  templateUrl: "./ticket-legal-reportes-internos-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    LxIcon,
    LuxDataViewMobile,
    LxEmptyState,
    MobileListItem,
    LxTag,
  ],
})
export class TicketLegalReportesInternosMobile {
  reportData = input<any>(null);
  requestsAttended = input.required<any[]>();
  requestsPending = input.required<any[]>();
}
