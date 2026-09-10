import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ContractRenewalService } from "./services/contract-renewal.service";
import { ContractRenewalEvaluationDTO, ContractRenewalStatus } from "./employees/interfaces/contract-renewal.dto";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ContractRenewalFormComponent } from "./contract-renewal-form";
import { DynamicDialogRef } from "primeng/dynamicdialog";

type StatusSeverity = "info" | "success" | "warn" | "danger" | "secondary" | "contrast";
import { DialogSize } from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-contract-renewal-list",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="contract-renewal-list">
      <div class="list-header">
        <h2 class="list-title">
          <app-icon name="file-clock" class="title-icon" />
          Bandeja de Renovaciones
        </h2>
        <div class="header-actions">
          <p-button
            label="Actualizar"
            (onClick)="loadRenewals(true)"
            [loading]="renewalService.isLoading()"
            styleClass="p-button-outlined"
          >
            <ng-template #icon>
              <app-icon icon="material-symbols-light:refresh" />
            </ng-template>
          </p-button>
        </div>
      </div>

      <!-- Alert banner if there are pending renewals -->
      @if (pendingCount() > 0) {
        <div class="alert-banner">
          <app-icon name="alert-circle" class="alert-icon" />
          <span>
            <strong>{{ pendingCount() }}</strong> renovaciones pendientes de decisión
          </span>
        </div>
      }

      <!-- p-table - única excepción PrimeNG permitida -->
      <p-table
        [value]="renewalService.renewals()"
        [loading]="renewalService.isLoading()"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} renovaciones"
        [rowsPerPageOptions]="[10, 25, 50]"
        responsiveLayout="scroll"
        sortMode="multiple"
        [globalFilterFields]="['employeeName', 'positionName', 'contractNumber']"
        [tableStyle]="{ 'min-width': '50rem' }"
        dataKey="id"
      >
        <ng-template pTemplate="caption">
          <div class="table-caption">
            <span class="caption-title">Listado de Renovaciones de Contratos</span>
            <div class="caption-filters">
              <input
                type="text"
                pInputText
                placeholder="Buscar por empleado, puesto o contrato..."
                (input)="onGlobalFilter($event)"
                class="filter-input"
              />
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="employeeName">
              Empleado
              <p-sortIcon field="employeeName" />
            </th>
            <th pSortableColumn="positionName">
              Puesto
              <p-sortIcon field="positionName" />
            </th>
            <th pSortableColumn="contractEndDate">
              Fecha Vencimiento
              <p-sortIcon field="contractEndDate" />
            </th>
            <th pSortableColumn="status">
              Estatus Evaluación
              <p-sortIcon field="status" />
            </th>
            <th pSortableColumn="decisionDate">
              Fecha Decisión
              <p-sortIcon field="decisionDate" />
            </th>
            <th style="width: 8rem">Acciones</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-renewal>
          <tr>
            <td>
              <div class="employee-cell">
                <app-icon name="user" class="cell-icon" />
                <span>{{ renewal.employeeName }}</span>
              </div>
            </td>
            <td>
              <div class="position-cell">
                <app-icon name="briefcase" class="cell-icon" />
                <span>{{ renewal.positionName }}</span>
              </div>
            </td>
            <td>
              <span class="date-cell">
                {{ renewal.contractEndDate | date: "dd/MM/yyyy" }}
              </span>
            </td>
            <td>
              <p-tag
                [value]="getStatusLabel(renewal.status)"
                [severity]="getStatusSeverity(renewal.status)"
              />
            </td>
            <td>
              <span class="date-cell">
                {{ renewal.decisionDate | date: "dd/MM/yyyy" }}
              </span>
            </td>
            <td>
              <div class="actions-cell">
                <button
                  pButton
                  type="button"
                  class="p-button-text p-button-sm"
                  pTooltip="Ver detalles"
                  (click)="openDecisionModal(renewal)"
                  [disabled]="renewal.status === 'Decidido'"
                >
                  <app-icon icon="material-symbols-light:visibility" />
                </button>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center py-4">
              <div class="empty-state">
                <app-icon name="file-check" class="empty-icon" />
                <p>No hay renovaciones registradas</p>
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="footer">
          <tr>
            <td colspan="6">
              <div class="footer-summary">
                <span class="summary-item">
                  <strong>Total:</strong> {{ renewalService.renewals().length }}
                </span>
                <span class="summary-item">
                  <strong>Pendientes:</strong> {{ pendingCount() }}
                </span>
                <span class="summary-item">
                  <strong>Decididas:</strong> {{ decidedCount() }}
                </span>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: `
    .contract-renewal-list {
      padding: 1rem;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .list-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .title-icon {
      font-size: 1.75rem;
      color: var(--primary-color);
    }

    .alert-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background-color: var(--surface-200);
      border-left: 4px solid var(--yellow-500);
      border-radius: 4px;
      margin-bottom: 1rem;
      color: var(--text-color);
    }

    .alert-icon {
      color: var(--yellow-500);
    }

    .table-caption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--surface-ground);
      border-bottom: 1px solid var(--surface-border);
    }

    .caption-title {
      font-weight: 600;
      font-size: 1.1rem;
    }

    .filter-input {
      min-width: 300px;
    }

    .employee-cell,
    .position-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .cell-icon {
      color: var(--text-color-secondary);
      font-size: 1rem;
    }

    .date-cell {
      font-family: var(--font-family-monospace);
      white-space: nowrap;
    }

    .actions-cell {
      display: flex;
      justify-content: flex-end;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 2rem;
      color: var(--text-color-secondary);
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--surface-400);
    }

    .footer-summary {
      display: flex;
      gap: 2rem;
      padding: 1rem;
      background: var(--surface-100);
      border-radius: 0 0 6px 6px;
    }

    .summary-item {
      color: var(--text-color);
    }
  `,
})
export class ContractRenewalListComponent implements OnInit {
  protected readonly renewalService = inject(ContractRenewalService);
  protected readonly dialogHandler = inject(DialogHandlerService);

  // Computed counts
  pendingCount = computed(() =>
    this.renewalService.renewals().filter((r) => r.status === "EnAnalisis").length
  );

  decidedCount = computed(() =>
    this.renewalService.renewals().filter((r) => r.status === "Decidido").length
  );

  ngOnInit(): void {
    this.loadRenewals();
  }

  loadRenewals(forceRefresh = false): void {
    try {
      const customerId = "1"; // TODO: Get from current user context
      this.renewalService.loadAll(customerId, forceRefresh).then(() => {
        // Data is set internally in the service
      }).catch((error) => {
        console.error("Error loading renewals:", error);
      });
    } catch (error) {
      console.error("Error loading renewals:", error);
    }
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Table global filter is handled by p-table automatically
  }

  protected getStatusLabel(status: ContractRenewalStatus): string {
    const labels: Record<string, string> = {
      EnAnalisis: "En Análisis",
      EvaluacionCompletada: "Evaluación Completada",
      Decidido: "Decidido",
      Cancelado: "Cancelado",
    };
    return labels[status] ?? status;
  }

  protected getStatusSeverity(status: ContractRenewalStatus): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    const severities: Record<string, "info" | "success" | "warn" | "danger" | "secondary" | "contrast"> = {
      EnAnalisis: "warn",
      EvaluacionCompletada: "info",
      Decidido: "success",
      Cancelado: "danger",
    };
    return severities[status] ?? "secondary";
  }

  async openDecisionModal(renewal: ContractRenewalEvaluationDTO): Promise<void> {
    const result = await this.dialogHandler.openDialog<{ action: string }>(
      ContractRenewalFormComponent,
      { renewal },
      `Decisión de Renovación - ${renewal.contractNumber}`,
      "lg" as DialogSize
    );

    if (result) {
      console.log("Decision result:", result);
      // Reload data
      this.loadRenewals(true);
    }
  }
}