import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IAspelDatosCombinadosDTO,
  IAspelPolizaConDetalleDTO,
} from "../../models/aspel-budget.interface";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-listados-aspel",

  imports: [CommonModule, FormsModule, TableModule, TabsModule, CustomButton],
  templateUrl: "./listados-aspel.html",
})
export class ListadosAspel {
  private readonly apiS = inject(ApiResponseService);
  public readonly customerIdS = inject(CustomerIdService);
  public readonly filterS = reportFilterState;

  // ── Estado ──────────────────────────────────────────────────────────────────
  loading = signal<boolean>(false);
  rawData = signal<IAspelDatosCombinadosDTO | null>(null);
  selectedPoliza = signal<IAspelPolizaConDetalleDTO | null>(null);

  constructor() {
    // Recarga automática cuando cambia cliente o año
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      if (custId && yr) {
        this.loadRawData(custId, yr);
      }
    });
  }

  async loadRawData(customerId: string, year: number) {
    this.loading.set(true);
    this.rawData.set(null);
    this.selectedPoliza.set(null);

    const result = await this.apiS.onGetItem<IAspelDatosCombinadosDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.debugRawAspelData(
        customerId,
        year,
      ),
    );

    if (result) {
      this.rawData.set(result);
    }
    this.loading.set(false);
  }

  onSelectPoliza(poliza: IAspelPolizaConDetalleDTO) {
    this.selectedPoliza.set(poliza);
  }
}
