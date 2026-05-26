import { CommonModule, formatDate } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import * as FileSaver from "file-saver";
import { TableModule } from "primeng/table";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { RangoCalendarioyyyymmdd } from "src/app/core/components/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { FiltroCalendarService } from "src/app/core/services/filtro-calendar.service";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-reporte",
  templateUrl: "./recepcion-pipas-agua-reporte.html",
  imports: [
    CommonModule,
    TableModule,
    RangoCalendarioyyyymmdd,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
  ],
})
export class RecepcionPipasAguaReporte implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  filtroCalendarService = inject(FiltroCalendarService);

  dataSignal = signal<IRecepcionPipaAgua[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  fechasSignal = toSignal(this.filtroCalendarService.fechas$);

  fechaInicio = signal(
    this.dateS.getDateFormat(this.filtroCalendarService.fechaInicioDateFull),
  );
  fechaFin = signal(
    this.dateS.getDateFormat(this.filtroCalendarService.fechaFinalDateFull),
  );

  totalLitros = computed(() =>
    this.dataSignal().reduce((acc, x) => acc + (x.capacidadPipa ?? 0), 0),
  );
  totalRecepciones = computed(() => this.dataSignal().length);
  recepccionesEnCurso = computed(
    () => this.dataSignal().filter((x) => !x.horaTermino).length,
  );

  constructor() {
    // Reacciona al cambio de rango de fechas en el selector compartido
    const fechas = this.fechasSignal;
    if (fechas) {
      this.fechaInicio.set(fechas()?.fechaInicio ?? this.fechaInicio());
      this.fechaFin.set(fechas()?.fechaFinal ?? this.fechaFin());
    }
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const url = `recepcion-pipas-agua/list/${this.customerIdS.customerId()}?fechaInicio=${this.fechaInicio()}&fechaFin=${this.fechaFin()}`;
    this.apiResponseS
      .onGetList(`recepcion-pipas-agua/list/${this.customerIdS.customerId()}`)
      .then((result: IRecepcionPipaAgua[]) => {
        const inicio = new Date(this.fechaInicio());
        const fin = new Date(this.fechaFin());
        fin.setHours(23, 59, 59);
        this.dataSignal.set(
          (result ?? []).filter((x) => {
            const fecha = new Date(x.horaLlegada);
            return fecha >= inicio && fecha <= fin;
          }),
        );
      });
  }

  onFechasChange(event: { fechaInicio: string; fechaFinal: string }) {
    this.fechaInicio.set(event.fechaInicio);
    this.fechaFin.set(event.fechaFinal);
    this.onLoadData();
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const rows = this.dataSignal().map((item) => ({
        Placas: item.placasCamion,
        Llegada: item.horaLlegada
          ? formatDate(item.horaLlegada, "dd/MM/yyyy HH:mm", "es-MX")
          : "",
        Termino: item.horaTermino
          ? formatDate(item.horaTermino, "dd/MM/yyyy HH:mm", "es-MX")
          : "En curso",
        "Capacidad (L)": item.capacidadPipa,
        "Cisterna antes": item.nivelCisternaAntes,
        "Cisterna despues": item.nivelCisternaDespues,
        // "Metro antes": item.lecturaMetroAntes,
        // "Metro despues": item.lecturaMetroDespues,
      }));
      const ws = xlsx.utils.json_to_sheet(rows);
      const wb = { Sheets: { Reporte: ws }, SheetNames: ["Reporte"] };
      const buffer: any = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      FileSaver.saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }),
        `recepcion-pipas-${this.fechaInicio()}-${this.fechaFin()}.xlsx`,
      );
    });
  }
}
