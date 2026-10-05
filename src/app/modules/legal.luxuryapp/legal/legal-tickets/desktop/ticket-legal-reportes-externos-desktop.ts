import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-ticket-legal-reportes-externos-desktop",
  templateUrl: "./ticket-legal-reportes-externos-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    AppTable,
    AppIcon,
    LxEmptyState,
    LuxTableCaption,
  ],
})
export class TicketLegalReportesExternosDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  reportData = input<any>(null);
  kpiRows = input<any[]>([]);
  requestsAttended = input.required<any[]>();
  requestsPending = input.required<any[]>();
}
