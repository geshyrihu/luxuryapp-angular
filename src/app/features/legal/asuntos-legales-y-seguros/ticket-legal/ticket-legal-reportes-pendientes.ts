import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
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
    IonItem,
    IonLabel,
    PageTitleReport,
    PrimeNgCustomCaption,
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
    this.apiResponseS.onGetList(Endpoints.Tasks.legalPending(false)).then((result: any) => {
      this.dataExternal.set(result ?? []);
    });
  }
  onLoadDataInternal() {
    this.apiResponseS.onGetList(Endpoints.Tasks.legalPending(true)).then((result: any) => {
      this.dataInternal.set(result ?? []);
    });
  }
  onLoadUnassignedData() {
    this.apiResponseS.onGetList(Endpoints.Tasks.legalPending(undefined, true)).then((result: any) => {
      this.unassignedData.set(result ?? []);
    });
  }
}









