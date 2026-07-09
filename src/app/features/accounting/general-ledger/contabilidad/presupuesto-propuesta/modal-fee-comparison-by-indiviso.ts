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
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxMessage } from "@ui/adaptive/message/message";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { IndivisoFeeComparisonDTO } from "./models/indiviso-fee-comparison.model";
@Component({
  selector: "app-fee-comparison-by-indiviso-modal",
  template: `
    <div class="flex flex-col ">
      @if (comparisonData(); as data) {
        <div class="card">
          <div class="card-body">
            <p class="text-600 flex items-center ">
              Cólculo basado en el porcentaje de indiviso de cada propiedad.
              <span
                class="text-xs font-semibold px-2 py-1 border-round bg-blue-100 text-blue-700"
                title="Suma total de todos los porcentajes de indiviso"
              >
                S Indiviso:
                {{ data.totalIndivisoPercentage | number: "1.2-2" }}%
              </span>
            </p>

            <div class="grid text-center mt-4">
              <!-- Columna Cuota Actual -->
              <div class="col-12 md:col-4 p-4 border-right-1 surface-border">
                <h6 class="text-uppercase font-semibold">
                  Presupuesto Actual (Mensual por Indiviso)
                </h6>
                <h3 class="text-4xl font-light">
                  {{
                    data.currentMonthlyFeeByIndiviso
                      | currency: "MXN" : "symbol" : "1.2-2"
                  }}
                </h3>
                <p class="mb-0">por indiviso</p>
                <lx-divider class="my-3"></lx-divider>
                <div class="text-600">
                  <div>
                    Total Anual:
                    {{
                      data.currentTotalBudget
                        | currency: "MXN" : "symbol" : "1.2-2"
                    }}
                  </div>
                </div>
              </div>

              <!-- Columna Nueva Cuota -->
              <div class="col-12 md:col-4 p-4 border-right-1 surface-border">
                <h6 class="text-uppercase font-semibold text-primary">
                  Presupuesto Propuesto (Mensual por Indiviso)
                </h6>
                <h3 class="text-4xl font-bold text-primary">
                  {{
                    data.newMonthlyFeeByIndiviso
                      | currency: "MXN" : "symbol" : "1.2-2"
                  }}
                </h3>
                <p class="mb-0">por indiviso</p>
                <lx-divider class="my-3"></lx-divider>
                <div class="text-600">
                  <div>
                    Total Anual:
                    {{
                      data.newTotalBudget | currency: "MXN" : "symbol" : "1.2-2"
                    }}
                  </div>
                </div>
              </div>

              <!-- Columna Diferencia Mensual -->
              <div class="col-12 md:col-4 p-4">
                <h6 class="text-uppercase font-semibold">
                  Diferencia Mensual (por Indiviso)
                </h6>
                <h3
                  class="text-4xl font-light"
                  [class.text-red-500]="data.monthlyFeeDifference > 0"
                  [class.text-green-500]="data.monthlyFeeDifference < 0"
                >
                  {{
                    data.monthlyFeeDifference
                      | currency: "MXN" : "symbol" : "1.2-2"
                  }}
                </h3>
                <p class="mb-0">por indiviso</p>
                <lx-divider class="my-3"></lx-divider>
                <div class="text-600">
                  <div>
                    Cambio:
                    {{ data.monthlyFeePercentageChange | percent: "1.0-2" }}
                  </div>
                </div>
              </div>
            </div>

            <lx-divider class="my-4">
              <h6 class="text-uppercase font-semibold">
                Detalle por Propiedad
              </h6>
            </lx-divider>

            <p-table
              [value]="data.propertyIndivisoDetails"
              [tableStyle]="{ 'min-width': '40rem' }"
            >
              <ng-template #header>
                <tr>
                  <th>Propiedad</th>
                  <th>% Indiviso</th>
                  <th>Cuota Mensual Actual (MXN)</th>
                  <th>Cuota Mensual Propuesta (MXN)</th>
                </tr>
              </ng-template>
              <ng-template #body let-detail>
                <tr>
                  <td>{{ detail.propertyName }}</td>
                  <td>{{ detail.indivisoPercentage | percent: "1.2-2" }}</td>
                  <td>
                    {{
                      detail.currentMonthlyFeeShare
                        | currency: "MXN" : "symbol" : "1.2-2"
                    }}
                  </td>
                  <td>
                    {{
                      detail.monthlyFeeShare
                        | currency: "MXN" : "symbol" : "1.2-2"
                    }}
                  </td>
                </tr>
              </ng-template>
              <ng-template #emptymessage>
                <tr>
                  <td colspan="4" class="text-center">
                    No hay detalles de propiedades disponibles.
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      } @else if (!loading()) {
        <lx-message severity="info">
          No hay datos de comparación disponibles.
        </lx-message>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    LxDivider,
    LxMessage,
  ],
})
export class FeeComparisonByIndivisoModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  proposalId: string = this.config.data.proposalId;
  comparisonData = signal<IndivisoFeeComparisonDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    if (this.proposalId) {
      this.loading.set(true);
      this.apiResponseS
        .onGetList<IndivisoFeeComparisonDTO>(
          `BudgetProposal/${this.proposalId}/fee-comparison-by-indiviso`,
        )
        .then((response) => {
          if (response && response.propertyIndivisoDetails) {
            response.propertyIndivisoDetails.sort(
              (a, b) => b.indivisoPercentage - a.indivisoPercentage,
            );
          }
          this.comparisonData.set(response || null);
          this.loading.set(false);
        })
        .catch((error) => {
          console.error("[FEE COMPARISON] Error al cargar datos:", error);
          this.loading.set(false);
        });
    } else {
      this.loading.set(false);
    }
  }
}
