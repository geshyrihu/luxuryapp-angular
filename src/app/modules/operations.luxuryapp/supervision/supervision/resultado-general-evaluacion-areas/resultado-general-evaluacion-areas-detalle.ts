import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { MultiSelectModule } from "@ui/web/primeng-multiselect/primeng-multiselect";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-primeng-option";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-resultado-general-evaluacion-areas-detalle",
  templateUrl: "./resultado-general-evaluacion-areas-detalle.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DataViewMobile,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    MultiSelectModule,
    PrimeNgCustomCaption,
    CommonModule,
    SanitizeHtmlPipe,
  ],
})
export class ResultadoGeneralEvaluacionAreasDetalle implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.onLoadData(
      this.config.data.fecha,
      this.config.data.area,
      this.config.data.status,
    );
  }

  onLoadData(fecha: string, area: number, status?: number) {
    const urlApi = Endpoints.ResumenGeneral.evaluationAreasDetail(
      fecha,
      area,
      status,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
}

