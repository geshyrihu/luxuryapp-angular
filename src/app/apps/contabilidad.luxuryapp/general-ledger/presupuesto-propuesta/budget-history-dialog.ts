/**
 * ============================================================================
 * ?? ADVERTENCIA CRóTICA / CRITICAL WARNING ??
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
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { BudgetProposalItemHistoryDTO } from "src/app/apps/contabilidad.luxuryapp/general-ledger/presupuesto-propuesta/interfaces/budget-proposal.model";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-budget-history-dialog",
  imports: [CommonModule, TableModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./budget-history-dialog.html",
})
export class BudgetHistoryDialog implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  loading = signal(true);
  history = signal<BudgetProposalItemHistoryDTO[]>([]);
  errorMensaje: string | null = null;

  itemId: string = this.config.data.itemId;
  accountName: string = this.config.data.accountName;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<BudgetProposalItemHistoryDTO[]>(
        Endpoints.BudgetProposal.historyByItem(this.itemId),
      )
      .then((response) => {
        if (response) {
          this.history.set(response);
        } else {
          this.errorMensaje = "No se encontré historial para esta partida.";
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje = error.message || "Error al cargar el historial.";
        console.error("Error loading budget item history:", error);
        this.loading.set(false);
      });
  }

  closeDialog(): void {
    this.ref.close();
  }
}
