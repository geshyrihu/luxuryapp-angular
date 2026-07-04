/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explócita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AiService } from "src/app/core/services/ai.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { BudgetProposalItemDTO } from "./models/budget-proposal.model";

@Component({
  selector: "app-budget-forecast-dialog",
  templateUrl: "./budget-forecast-dialog.html",
  imports: [CommonModule, WebButtonLabel, TableModule, FormsModule],
})
export class BudgetForecastDialog implements OnInit {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private aiService = inject(AiService);
  private customToastService = inject(CustomToastService);

  loading = signal<boolean>(true);
  forecastData = signal<any[]>([]);
  selectedForecastItems = signal<any[]>([]);
  inflationRate = signal<number>(5);
  selectedMonthsForAvg = signal<string[]>([]);

  ngOnInit() {
    this.inflationRate.set(this.config.data?.inflationRate || 5);
    this.selectedMonthsForAvg.set(this.config.data?.selectedMonthsForAvg || []);
    this.runForecast();
  }

  async runForecast() {
    const items: BudgetProposalItemDTO[] = this.config.data?.items || [];

    if (items.length === 0) {
      this.customToastService.showWarn(
        "Sin datos",
        "No hay partidas para proyectar.",
      );
      this.close();
      return;
    }

    this.loading.set(true);

    try {
      const context = items
        .map((item) => {
          if (item.esFilaAgrupadora) return null;
          const avgExpense = this.getAverageMonthlyExpense(item);
          return `- [${item.accountNumber}] ${item.accountName}: GastoPromedio${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}=$${Math.round(avgExpense)}`;
        })
        .filter(Boolean)
        .join("\n");

      const jsonResponse = await this.aiService.getBudgetForecast(
        context,
        this.inflationRate(),
      );

      const parsed = JSON.parse(jsonResponse);
      const data = parsed.map((aiItem: any) => {
        const originalItem = items.find(
          (i) => i.accountNumber.toString() === aiItem.accountNumber.toString(),
        );
        return {
          ...aiItem,
          accountName: originalItem?.accountName || "",
          currentAmount: originalItem?.currentAmount || 0,
          averageExpense: originalItem
            ? this.getAverageMonthlyExpense(originalItem)
            : 0,
        };
      });

      this.forecastData.set(data);
      this.selectedForecastItems.set([...data]);
    } catch (error) {
      console.error(error);
      this.customToastService.showError(
        "Error",
        "No se pudo generar la proyección.",
      );
      this.close();
    } finally {
      this.loading.set(false);
    }
  }

  apply() {
    this.ref.close(this.selectedForecastItems());
  }

  close() {
    this.ref.close();
  }

  private getAverageMonthlyExpense(item: BudgetProposalItemDTO): number {
    if (!item || item.esFilaAgrupadora) return 0;

    const monthToExpensePropertyMap: {
      [key: string]: keyof BudgetProposalItemDTO;
    } = {
      enero: "gastoEnero",
      febrero: "gastoFebrero",
      marzo: "gastoMarzo",
      abril: "gastoAbril",
      mayo: "gastoMayo",
      junio: "gastoJunio",
      julio: "gastoJulio",
      agosto: "gastoAgosto",
      septiembre: "gastoSeptiembre",
      octubre: "gastoOctubre",
      noviembre: "gastoNoviembre",
      diciembre: "gastoDiciembre",
    };

    let expensesToAverage: number[] = [];

    if (this.selectedMonthsForAvg() && this.selectedMonthsForAvg().length > 0) {
      for (const monthName of this.selectedMonthsForAvg()) {
        const expenseProperty = monthToExpensePropertyMap[monthName];
        if (expenseProperty && typeof item[expenseProperty] === "number") {
          expensesToAverage.push(item[expenseProperty] as number);
        }
      }
    } else {
      expensesToAverage = [
        item.gastoEnero,
        item.gastoFebrero,
        item.gastoMarzo,
        item.gastoAbril,
        item.gastoMayo,
        item.gastoJunio,
        item.gastoJulio,
        item.gastoAgosto,
        item.gastoSeptiembre,
        item.gastoOctubre,
        item.gastoNoviembre,
        item.gastoDiciembre,
      ].filter((x): x is number => typeof x === "number");
    }

    const sum = expensesToAverage.reduce((a, b) => a + b, 0);
    return expensesToAverage.length ? sum / expensesToAverage.length : 0;
  }
}
