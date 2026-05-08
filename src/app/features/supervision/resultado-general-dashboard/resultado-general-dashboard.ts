import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Mesanio } from "src/app/core/components/mesanio/mesanio";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CustomButton } from "../../../core/components/buttons/web";
@Component({
  selector: "app-resultado-general-dashboard",
  templateUrl: "./resultado-general-dashboard.html",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CustomButton,
    MultiSelectModule,
    CustomInputTextSignal,
    TagModule,
    ProgressBarModule,
    Mesanio,
  ],
})
export class ResultadoGeneralDashboard implements OnInit {
  apiResponseS = inject(ApiResponseService);
  PeriodMonthService = inject(PeriodMonthService);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);
  reporteFiltro: string = "MINUTAS GENERAL";

  ref: DynamicDialogRef;
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  cb_customers: any[] = [];
  periodo: string = "";
  nivelReporte: number = 0;
  mostrar: boolean = false;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`NombreCorto`)
      .then((response: any) => {
        this.cb_customers = response.map((selectList: any) => ({
          label: selectList.label,
        }));
      });

    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadDataMinutas();
  }

  onFiltrarPeriodo(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadDataMinutas();
  }

  onFiltrarData(item: string) {
    this.reporteFiltro = item;
    this.onLoadDataMinutas();
  }

  onLoadDataMinutas() {
    this.reporteFiltro = "MINUTAS GENERAL";
    // Mostrar un mensaje de carga

    const urlApi = `ResumenGeneral/ReporteResumenMinutas/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}/${this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin)}/${this.nivelReporte}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataMinutaFiltro(EAreaMinutasDetalles: number) {
    const urlApi = `ResumenGeneral/ReporteResumenMinutasFiltro/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoFin,
    )}/${EAreaMinutasDetalles}/${this.nivelReporte}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataPreventivos() {
    const urlApi = `ResumenGeneral/ReporteResumenPreventivos/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}/${this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin)}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onLoadDataTickets() {
    const urlApi = `ResumenGeneral/ReporteResumenTicket/${this.dateS.getDateFormat(
      this.PeriodMonthService.getPeriodoInicio,
    )}/${this.dateS.getDateFormat(this.PeriodMonthService.getPeriodoFin)}`;

    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onValueProgress(value: number) {
    let color = "";
    if (value <= 94) {
      color = "#EF4444"; // red-500
    }
    if (value >= 100) {
      color = "#22C55E"; // green-500
    }
    if (value >= 95 && value <= 99) {
      color = "#F59E0B"; // orange-500
    }
    return color;
  }
}
