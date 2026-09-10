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
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-presentaciones-juntas-comite",
  templateUrl: "./presentaciones-juntas-comite.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconViewPdf,
    PrimeNgCustomTableEmptyMessage,
    ReactiveFormsModule,
    TableModule,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    WebButtonLabelViewPdf,
    CustomInputTextSignal,

    WebButtonLabelViewPdf,
    MobileListItem,
    AppIcon,
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
  tablePrimeNgRows: number = tablePrimeNgRows();
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
