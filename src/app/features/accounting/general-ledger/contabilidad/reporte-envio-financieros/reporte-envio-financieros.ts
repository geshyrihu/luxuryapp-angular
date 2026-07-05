import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { PeriodMonthService } from "src/app/core/services/periodo-month.service";

import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
@Component({
  selector: "app-reporte-envio-financieros",
  templateUrl: "./reporte-envio-financieros.html",
  styleUrls: ["./reporte-envio-financieros.scss"],
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    TagModule,
    TooltipModule,
    CustomInputSelectSignal,
    FormsModule,
  ],
})
export class ReporteEnvioFinancieros implements OnInit {
  apiResponseS = inject(ApiResponseService);
  public PeriodMonthService = inject(PeriodMonthService);
  dateS = inject(DateService);
  // Declaración e inicialización de variables
  dataSignal = signal<any[]>([]);
  monthNames: string[] = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  years: any[] = [];
  selectedYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef; // Referencia a un cuadro de diólogo modal

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2024; i--) {
      this.years.push({ label: i.toString(), value: i });
    }
    this.onLoadData();
  }

  // Función para cargar los datos de los reporte
  onLoadData() {
    this.apiResponseS
      .onGetList(`FinancialReport/reporte-envio-anual/${this.selectedYear}`)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onChangeYear() {
    this.onLoadData();
  }
}









