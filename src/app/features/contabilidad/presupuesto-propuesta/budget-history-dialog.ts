import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { BudgetProposalItemHistoryDTO } from "src/app/features/contabilidad/presupuesto-propuesta/models/budget-proposal.model";
@Component({
  selector: "app-budget-history-dialog",
  imports: [CommonModule, TableModule],
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
        `BudgetProposal/history/${this.itemId}`,
      )
      .then((response) => {
        if (response) {
          this.history.set(response);
        } else {
          this.errorMensaje = "No se encontró historial para esta partida.";
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









