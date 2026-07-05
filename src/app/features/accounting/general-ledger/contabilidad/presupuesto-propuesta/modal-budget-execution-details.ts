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
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
@Component({
  selector: "app-budget-execution-details-modal",
  templateUrl: "./budget-execution-details-modal.html",
  imports: [CommonModule, TableModule, TagModule],
})
export class BudgetExecutionDetailsModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  accountNumber: string = "";
  month: string = "";
  budgetExecutions = signal<any[] | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.accountNumber = this.config.data.accountNumber;
    this.month = this.config.data.month;
    if (this.accountNumber) {
      this.onLoadData();
    } else {
      this.loading.set(false);
    }
  }

  onLoadData(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<any>(
        `ProjectedExpenses/by-account-id/${this.customerIdS.customerId()}/${this.month}/${
          this.accountNumber
        }`,
      )
      .then((result) => {
        this.budgetExecutions.set(result);
        this.loading.set(false);
      });
  }

  onClose(): void {
    this.ref.close();
  }
}









