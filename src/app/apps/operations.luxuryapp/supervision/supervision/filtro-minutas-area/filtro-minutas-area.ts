import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EAreaMinutasDetallesPipe } from "src/app/shared/pipes/area-minuta-detalles.pipe";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-filtro-minutas-area",
  templateUrl: "./filtro-minutas-area.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    PrimeNgCustomTableEmptyMessage,
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
    //   onGetSelectItemFromEnum(AreaMinutasDetalles),
    //   this.config.data.area
    // );
  }

  onLoadData() {
    const urlApi =
      Endpoints.RefactorOperations.dashboardFiltroMinutasAreaByIdByIdById(
        this.meetingId,
        this.area,
        this.estatus,
      );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
