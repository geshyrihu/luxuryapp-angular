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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-ticket-legal-reportes-pendientes",
  templateUrl: "./ticket-legal-reportes-pendientes.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    CardModule,
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
