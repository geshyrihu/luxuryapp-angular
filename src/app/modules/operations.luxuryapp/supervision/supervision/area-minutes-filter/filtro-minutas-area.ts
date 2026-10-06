import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { EnumSelectService } from "@core/services/enum-select.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { EAreaMinutasDetallesPipe } from "@shared/pipes/area-minuta-detalles.pipe";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
@Component({
  selector: "app-filtro-minutas-area",
  templateUrl: "./filtro-minutas-area.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    TableEmptyMessage,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    EAreaMinutasDetallesPipe,
    SanitizeHtmlPipe],
})
export class FiltroMinutasArea implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
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
    const urlApi = Endpoints.Dashboard.filtroMinutasArea(
      this.meetingId,
      this.area,
      this.estatus,
    );

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}
