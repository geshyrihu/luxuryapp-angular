import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
@Component({
  selector: "app-ticket-legal-reportes-pendientes",
  templateUrl: "./ticket-legal-reportes-pendientes.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ApiDatePipe,
    AppTable,
    AppIcon,
    DataViewMobile,
    LxEmptyState,
    PageTitleReport,
    LuxTableCaption,
    MobileListItem,
  ],
})
export class TicketLegalReportesPendientes implements OnInit {
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataExternal = signal<any[]>([]);
  dataInternal = signal<any[]>([]);
  unassignedData = signal<any[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadDataExternal();
    this.onLoadDataInternal();
    this.onLoadUnassignedData();
  }

  onLoadDataExternal() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(false))
      .then((result: any) => {
        this.dataExternal.set(result ?? []);
      });
  }
  onLoadDataInternal() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(true))
      .then((result: any) => {
        this.dataInternal.set(result ?? []);
      });
  }
  onLoadUnassignedData() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(undefined, true))
      .then((result: any) => {
        this.unassignedData.set(result ?? []);
      });
  }
}
