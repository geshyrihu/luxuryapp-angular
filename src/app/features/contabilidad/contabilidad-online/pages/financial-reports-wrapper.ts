import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TabsModule } from "primeng/tabs";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";

import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { AiAgentComponent } from "../components/ai-agent/ai-agent";
import { reportFilterState } from "../state/financial-report-filter.state";
import { AnalisisCobranza } from "./analisis-cobranza/analisis-cobranza";
import { CedulaExtraordinaria } from "./cedula-extraordinaria/cedula-extraordinaria";
import { CedulaPresupuestal } from "./cedula-presupuestal/cedula-presupuestal";
import { EstadoPosicionFinanciera } from "./estado-posicion-financiera/estado-posicion-financiera";
import { EstadoResultados } from "./estado-resultados/estado-resultados";
import { FlujoEfectivo } from "./flujo-caja/flujo-efectivo";
import { ListadosAspel } from "./listados-aspel/listados-aspel";

@Component({
  selector: "app-financial-reports-wrapper",
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    EstadoPosicionFinanciera,
    EstadoResultados,
    CedulaExtraordinaria,
    CedulaPresupuestal,
    FlujoEfectivo,
    AnalisisCobranza,
    ListadosAspel,
    CustomButton,
    AiAgentComponent,
  ],
  templateUrl: "./financial-reports-wrapper.html",
})
export default class FinancialReportsWrapper {
  public filterS = reportFilterState;

  reportIndex = signal<number>(0);
  REPORTS = [
    "Estado de Posición Financiera",
    "Estado de Resultados",
    "Cédula de Cuotas Extraordinarias",
    "Cédula Presupuestal vs Gastos",
    "Flujo de Efectivo",
    "Análisis de Cobranza",
    "Depuración Aspel (Raw)",
  ];

  nextReport() {
    if (this.reportIndex() < this.REPORTS.length - 1) {
      this.reportIndex.update((v) => v + 1);
    }
  }

  prevReport() {
    if (this.reportIndex() > 0) {
      this.reportIndex.update((v) => v - 1);
    }
  }
}
