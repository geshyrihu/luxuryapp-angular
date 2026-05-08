import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { Mesanio } from "src/app/core/components/mesanio/mesanio";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";
@Component({
  selector: "app-reporte-envio-financieros",
  templateUrl: "./reporte-envio-financieros.html",
  styleUrls: ["./reporte-envio-financieros.scss"],
  imports: [TableModule, TagModule, PrimeNgCustomCaption, Mesanio],
})
export class ReporteEnvioFinancieros implements OnInit {
  apiResponseS = inject(ApiResponseService);
  public PeriodMonthService = inject(PeriodMonthService);
  dateS = inject(DateService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal
  periodo: string = "";

  ngOnInit(): void {
    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadData();
  }

  // Función para cargar los datos de los reporte
  onLoadData() {
    this.apiResponseS
      .onGetList(
        `FinancialReport/reporteenviomensual/${this.dateS.getDateFormat(
          this.PeriodMonthService.getPeriodoInicio,
        )}`,
      )
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onFiltrarPeriodo(periodo: string) {
    this.PeriodMonthService.setPeriodo(periodo);
    this.periodo = this.dateS.getNameMontYear(
      this.PeriodMonthService.fechaInicial,
    );
    this.onLoadData();
  }
}









