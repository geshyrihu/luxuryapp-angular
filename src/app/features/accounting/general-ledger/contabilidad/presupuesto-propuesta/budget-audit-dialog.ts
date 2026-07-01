/**
 * ============================================================================
 * ‚ö†Ô∏è ADVERTENCIA CR√çTICA / CRITICAL WARNING ‚ö†Ô∏è
 * ============================================================================
 * Este mÛdulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lÛgica, estructura o flujos de IA
 * sin antes consultar y obtener autorizaciÛn explÌcita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el cÛdigo.
 * ============================================================================
 */
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { AiService } from "src/app/core/services/ai.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { BudgetProposalItemDTO } from "./models/budget-proposal.model";
@Component({
  selector: "app-budget-audit-dialog",
  templateUrl: "./budget-audit-dialog.html",
  imports: [WebButtonLabel],
})
export class BudgetAuditDialog implements OnInit {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private aiService = inject(AiService);
  private customToastService = inject(CustomToastService);
  auditReportHtml = signal<string>("");
  loading = signal<boolean>(true);

  ngOnInit() {
    this.runAudit();
  }

  async runAudit() {
    const items: BudgetProposalItemDTO[] = this.config.data?.items || [];

    if (items.length === 0) {
      this.customToastService.showWarn(
        "Sin datos",
        "No hay partidas para auditar.",
      );
      this.close();
      return;
    }

    try {
      const context = items
        .map((item) => {
          const avgExpense = this.getAverageMonthlyExpense(item) * 12;
          const proposed = item.proposedAmount * 12;
          const diffPercent = item.percentageIncrease
            ? Math.round(item.percentageIncrease)
            : 0;
          if (avgExpense === 0 && proposed === 0) return null;
          return `- [${item.accountNumber}] ${item.accountName}: GastoProm${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear - 1 || new Date().getFullYear() - 1}=$${Math.round(avgExpense)}, Propuesta${this.config.data?.items?.[0]?.BudgetProposal?.FiscalYear || new Date().getFullYear()}=$${Math.round(proposed)}, Inc=${diffPercent}%`;
        })
        .filter(Boolean)
        .join("\n");

      const analysisHtml = await this.aiService.auditBudget(context);
      this.auditReportHtml.set(analysisHtml);
    } catch (error) {
      console.error(error);
      this.auditReportHtml.set(
        "<p class='text-red-500'>OcurriÛ un error al generar la auditorÌa. Por favor intente nuevamente.</p>",
      );
      this.customToastService.showError(
        "Error",
        "No se pudo completar el an·lisis IA.",
      );
    } finally {
      this.loading.set(false);
    }
  }

  close() {
    this.ref.close();
  }

  // Helper function logic copied from parent for independence
  private getAverageMonthlyExpense(item: BudgetProposalItemDTO): number {
    if (!item || item.esFilaAgrupadora) return 0;

    // Use specific months property if selected, locally we calculate average of all for simplicity
    // or we could pass the context readiness from parent.
    // To simplify: I'll assume we pass the raw items and need to calculate averages.
    // Since logic in parent was complex with selectedMonths, it's better if parent passes the PREPARED context string?
    // User requested "desacoplar" (decouple).
    // If I pass items, I duplicate the logic.
    // If I pass the context string directly, the dialog is purely display/service call.
    // Let's pass the ITEMS but we need the average calculation logic.
    // For now, I'll copy the basic logic for full year average as it's an audit.

    // Actually, looking at the parent code, getAverageMonthlyExpense uses 'selectedMonthsForAvg'.
    // If we want to respect that filter, we should pass it or pass the calculated averages.
    // Let's copy the helper logic but simplified to use all months as default for Audit unless specs say otherwise.
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
