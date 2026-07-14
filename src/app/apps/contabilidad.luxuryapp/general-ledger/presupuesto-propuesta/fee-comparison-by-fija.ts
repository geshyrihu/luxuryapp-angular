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

import { DividerModule } from "primeng/divider";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { LxCard } from "@ui/adaptive/card/card";
import { LxMessage } from "@ui/adaptive/message/message";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
// Definimos la interfaz del DTO aqué mismo para simplicidad
export interface IUniformFeeComparisonDTO {
  currentTotalBudget: number;
  newTotalBudget: number;
  propertyCount: number;
  currentMonthlyFee: number;
  newMonthlyFee: number;
}

@Component({
  selector: "app-fee-comparison-by-fija",
  imports: [CommonModule, TableModule, DividerModule, LxCard, LxMessage],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./fee-comparison-by-fija.html",
})
export class FeeComparisonByFija implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  loading = signal(true);
  comparisonData = signal<IUniformFeeComparisonDTO | null>(null);
  errorMensaje: string | null = null;

  proposalId: string = this.config.data.proposalId;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<IUniformFeeComparisonDTO>(
        Endpoints.BudgetProposal.feeComparison(this.proposalId),
      )
      .then((response) => {
        this.comparisonData.set(response);
        this.loading.set(false);
      });
  }
}
