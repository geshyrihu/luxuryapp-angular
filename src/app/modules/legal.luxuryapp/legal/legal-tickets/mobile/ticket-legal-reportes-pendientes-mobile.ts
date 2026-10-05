import {
  ChangeDetectionStrategy,
  Component,
  input,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-ticket-legal-reportes-pendientes-mobile",
  templateUrl: "./ticket-legal-reportes-pendientes-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiDatePipe, DataViewMobile, MobileListItem, AppIcon],
})
export class TicketLegalReportesPendientesMobile {
  dataExternal = input.required<any[]>();
  dataInternal = input.required<any[]>();
  unassignedData = input.required<any[]>();
}
