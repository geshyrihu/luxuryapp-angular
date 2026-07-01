import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IFinancialStatementDto } from "../../models/aspel-budget.interface";

@Component({
  selector: "app-catalog-replica",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    WebButtonLabel,
    InputTextModule,
    TagModule,
  ],
  templateUrl: "./catalog-replica.html",
})
export class CatalogReplica {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  // State
  loading = signal<boolean>(false);
  data = signal<IFinancialStatementDto | null>(null);
  year = signal<number>(new Date().getFullYear());
  private expandedSet = signal<Set<string>>(new Set());

  // Computed requeridos por el HTML
  cuentasFaltantes = computed(() => this.data()?.cuentasFaltantes ?? []);

  flatData = computed(() => {
    const d = this.data();
    if (!d) return [];
    const exp = this.expandedSet();
    const result: any[] = [];

    for (const clas of d.clasificaciones) {
      for (const mayor of clas.cuentasMayor ?? []) {
        const expanded = exp.has(mayor.numeroCuenta);
        result.push({ ...mayor, nivel: 1, expanded, visible: true });

        for (const sub of mayor.subcuentas ?? []) {
          result.push({
            ...sub,
            nivel: 2,
            visible: expanded,
            esCuentaMadre: false,
          });
          for (const det of sub.cuentasDetalle ?? []) {
            result.push({
              ...det,
              nivel: 3,
              visible: expanded,
              esCuentaMadre: false,
            });
          }
        }
      }
    }

    return result;
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.year();
      if (custId && yr) {
        this.loadData(custId, yr);
      }
    });
  }

  getSeverity(clasificacion: string): string {
    switch (clasificacion) {
      case "EPF":
        return "info";
      case "ER":
        return "success";
      case "CEDP":
        return "warn";
      case "FE":
        return "secondary";
      case "ACOB":
        return "danger";
      default:
        return "secondary";
    }
  }

  toggleNode(account: any) {
    const set = new Set(this.expandedSet());
    if (set.has(account.numeroCuenta)) set.delete(account.numeroCuenta);
    else set.add(account.numeroCuenta);
    this.expandedSet.set(set);
  }

  toggleAll(expand: boolean) {
    const d = this.data();
    if (!d) return;
    if (expand) {
      const allNivel1 = d.clasificaciones.flatMap((c) =>
        (c.cuentasMayor ?? []).map((m) => m.numeroCuenta),
      );
      this.expandedSet.set(new Set(allNivel1));
    } else {
      this.expandedSet.set(new Set());
    }
  }

  onLoadCatalog() {
    const custId = this.customerIdS.customerId();
    if (custId) {
      this.loadData(custId, this.year());
    }
  }

  async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);
    const result = await this.apiS.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.catalogValidation(
        customerId,
        year,
      ),
    );
    if (result) this.data.set(result);
    this.loading.set(false);
  }
}
