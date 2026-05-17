import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AiService } from "src/app/core/services/ai.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomButton } from "src/app/core/components/buttons/web";
import { BudgetProposalItemDTO } from "./models/budget-proposal.model";
@Component({
  selector: "app-budget-forecast-dialog",
  templateUrl: "./budget-forecast-dialog.html",
  imports: [CommonModule, CustomButton, TableModule, FormsModule],
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

  ngOnInit() {
    this.inflationRate.set(this.config.data?.inflationRate || 5);
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

    try {
      const context = items
        .map((item) => {
          if (item.esFilaAgrupadora) return null;
          const avgExpense = this.getAverageMonthlyExpense(item);
          return `- [${item.accountNumber}] ${item.accountName}: GastoPromedio2025=$${Math.round(avgExpense)}`;
        })
        .filter(Boolean)
        .join("\n");

      const jsonResponse = await this.aiService.getBudgetForecast(
        context,
        this.inflationRate(),
      );

      const data = JSON.parse(jsonResponse);
      this.forecastData.set(data);
      this.selectedForecastItems.set([...data]); // Select all by default
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

  // Helper function logic copied from parent for independence
  private getAverageMonthlyExpense(item: BudgetProposalItemDTO): number {
    if (!item || item.esFilaAgrupadora) return 0;
    const expenses = [
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

    const sum = expenses.reduce((a, b) => a + b, 0);
    return expenses.length ? sum / expenses.length : 0;
  }
}
