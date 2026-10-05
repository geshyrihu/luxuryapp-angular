import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-ticket-legal-reportes-pendientes-desktop",
  templateUrl: "./ticket-legal-reportes-pendientes-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiDatePipe, AppTable, LuxTableCaption],
})
export class TicketLegalReportesPendientesDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  dataExternal = input.required<any[]>();
  dataInternal = input.required<any[]>();
  unassignedData = input.required<any[]>();
}
