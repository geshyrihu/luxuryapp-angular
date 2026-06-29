import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { CustomButtonViewPdf } from "src/app/core/components/web/buttons";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
@Component({
  selector: "app-presentaciones-juntas-comite",
  templateUrl: "./presentaciones-juntas-comite.html",
  imports: [
    ReactiveFormsModule,
    TableModule,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    CustomButtonViewPdf,
    CustomInputTextSignal,

    CustomButtonViewPdf,
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
    const urlApi = "PresentacionJuntaComite/Generales/" + inicial + "/";
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  // navigateToPdf() {
  //   this.route.navigate(["documento/view-documento"]);
  // }
}

