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
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
@Component({
  selector: "app-budget-execution-details-modal",
  templateUrl: "./budget-execution-details-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, AppTable, AppSortableColumn, AppSorticon, AppIcon],
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
        `projected-expenses/by-account-id/${this.customerIdS.customerId()}/${this.month}/${
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
