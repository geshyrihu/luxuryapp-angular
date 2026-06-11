import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-ticket-legal-reportes-pendientes",
  templateUrl: "./ticket-legal-reportes-pendientes.html",
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    DatePipe,
    DataViewMobile,
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









