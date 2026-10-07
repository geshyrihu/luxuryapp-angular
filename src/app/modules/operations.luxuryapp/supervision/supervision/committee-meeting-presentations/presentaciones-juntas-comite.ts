import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DateService } from "@core/services/date.service";
import { FiltroCalendarService } from "@core/services/filtro-calendar.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-presentaciones-juntas-comite",
  templateUrl: "./presentaciones-juntas-comite.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    PdfViewerTrigger,
    TableEmptyMessage,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    NgbTooltipModule,
    LuxTableCaption,
    DataViewMobile,
    LuxInputTextSignal,
    MobileListItem,
    LxIcon,
  ],
})
export class PresentacionesJuntasComite implements OnInit {
  apiResponseS = inject(ApiResponseService);
  rangoCalendarioService = inject(FiltroCalendarService);
  route = inject(Router);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  periodoControl = new FormControl<string>(
    this.dateS.onParseToInputMonth(this.rangoCalendarioService.fechaInicial),
  );
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    let inicial = this.dateS.getDateFormat(
      new Date((this.periodoControl.value || "") + "-" + 1),
    );
    const urlApi = Endpoints.CommitteePresentations.generalByDate(inicial);
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  // navigateToPdf() {
  //   this.route.navigate(["documento/view-documento"]);
  // }
}
