import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { EAreaMinutasDetallesPipe } from "src/app/core/pipes/area-minuta-detalles.pipe";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-filtro-minutas-area",
  templateUrl: "./filtro-minutas-area.html",
  imports: [
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe,
  ],
})
export class FiltroMinutasArea implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  meetingId: any;
  area: number;
  areaName: string = "";
  titleEstatus: string = "";
  estatus: number;
  customerName: string = "";
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  async ngOnInit() {
    this.onLoadConfInitial();
    this.onLoadData();
  }

  onLoadConfInitial() {
    this.titleEstatus = this.config.data.titleEstatus;
    this.area = this.config.data.area;
    this.estatus = this.config.data.estatus;
    this.meetingId = this.config.data.meetingId;
    this.customerName = this.config.data.customerName;
    this.areaName = "Revisiar nombre";
    // this.areaName = onGetNameEnumeration(
    //   onGetSelectItemFromEnum(EAreaMinutasDetalles),
    //   this.config.data.area
    // );
  }

  onLoadData() {
    const urlApi = `Dashboard/FiltroMinutasArea/${this.meetingId}/${this.area}/${this.estatus}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}









