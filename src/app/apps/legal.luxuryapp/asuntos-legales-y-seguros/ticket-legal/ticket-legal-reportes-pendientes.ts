import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-ticket-legal-reportes-pendientes",
  templateUrl: "./ticket-legal-reportes-pendientes.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    DatePipe,
    AppIcon,
    DataViewMobile,
    LxEmptyState,
    PageTitleReport,
    PrimeNgCustomCaption,
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
