import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { IFechasFiltro } from "src/app/core/interfaces/fechas-filtro.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ResultadoGeneralEvaluacionAreasDetalle } from "./resultado-general-evaluacion-areas-detalle";
@Component({
  selector: "app-evaluacion-areas",
  templateUrl: "./resultado-general-evaluacion-areas.html",
  imports: [CommonModule, TableModule, PrimeNgCustomCaption],
})
export class ResultadoGeneralEvaluacionAreas implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  rangoCalendarioService = inject(FiltroCalendarService);
  tableScrollHeightS = inject(TableScrollHeightService);
  fechaInicial: string = "";
  fechaFinal: string = "";
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit() {
    this.fechaInicial = this.dateS.getDateFormat(
      this.rangoCalendarioService.fechaInicial,
    );
    this.fechaFinal = this.dateS.getDateFormat(
      this.rangoCalendarioService.fechaFinal,
    );
    this.onLoadData(this.fechaInicial, this.fechaFinal);
    this.rangoCalendarioService.fechasMOnth$.subscribe(
      (resp: IFechasFiltro) => {
        this.onLoadData(resp.fechaInicio, resp.fechaFinal);
      },
    );
  }
  onLoadData(fechaInicio: string, fechaFinal: string) {
    const urlApi = `ResumenGeneral/EvaluacionAreas/${fechaInicio}/${fechaFinal}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onModalFiltroMinutasArea(fecha: string, area: number, status?: number) {
    this.dialogHandlerS.openDialog(
      ResultadoGeneralEvaluacionAreasDetalle,
      {
        fecha: fecha,
        area: area,
        status: status,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }
}









