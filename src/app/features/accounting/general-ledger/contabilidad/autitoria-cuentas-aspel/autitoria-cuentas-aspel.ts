import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelDownload } from "src/app/core/components/buttons/web-label/button-download";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ReportFilterService } from "../espejo-aspel-full/services/financial-report-filter.service";
import { AutitoriaCuentasAspelExportService } from "./autitoria-cuentas-aspel-export.service";
import {
  IAutitoriaCuentaAspelCatalogoDTO,
  IAutitoriaCuentaAspelCustomerDTO,
  IAutitoriaCuentaAspelPresenciaDTO,
  IAutitoriaCuentasAspelResponseDTO,
} from "./autitoria-cuentas-aspel.models";

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";

@Component({
  selector: "app-autitoria-cuentas-aspel",
  imports: [
    WebButtonIcon,
    CommonModule,
    FormsModule,
    TableModule,
    SelectButtonModule,
    ProgressSpinnerModule,
    WebButtonLabel,
    WebButtonLabelDownload,
    CustomSearchInput,
    AppIcon,
  ],
  templateUrl: "./autitoria-cuentas-aspel.html",
})
export class AutitoriaCuentasAspel {
  private readonly apiS = inject(ApiResponseService);
  private readonly exportS = inject(AutitoriaCuentasAspelExportService);
  readonly filterS = inject(ReportFilterService);

  loading = signal(false);
  rawData = signal<IAutitoriaCuentasAspelResponseDTO | null>(null);
  empresaSeleccionada = signal<string>("Contabilidad");
  busquedaCatalogo = signal("");
  soloParciales = signal(false);

  empresaOptions = [
    { label: "Contabilidad", value: "Contabilidad" },
    { label: "Cobranza", value: "Cobranza" },
  ];

  readonly customers = computed(() => this.rawData()?.customers ?? []);

  readonly customerColumns = computed(() =>
    this.customers().filter((customer) => customer.estatus === "OK"),
  );

  readonly catalogoGeneral = computed(() =>
    this.filterCatalogo(
      this.rawData()?.catalogoGeneral ?? [],
      this.busquedaCatalogo(),
      this.soloParciales(),
    ),
  );

  constructor() {
    effect(() => {
      const year = this.filterS.year();
      const empresa = this.empresaSeleccionada();
      if (year && empresa) {
        void this.cargarDatos(year, empresa);
      }
    });
  }

  async cargarDatos(year: number, empresa: string) {
    this.loading.set(true);
    this.rawData.set(null);

    const result = await this.apiS.onGetItem<IAutitoriaCuentasAspelResponseDTO>(
      Endpoints.AutitoriaCuentasAspel.get(year, empresa),
    );

    if (result) {
      this.rawData.set(result);
    }

    this.loading.set(false);
  }

  customerStatusClass(customer: IAutitoriaCuentaAspelCustomerDTO): string {
    return customer.estatus === "OK" ? "text-green-600" : "text-red-600";
  }

  customerCoverageClass(customer: IAutitoriaCuentaAspelCustomerDTO): string {
    if (customer.porcentajeCoberturaCatalogo >= 95) return "text-green-600";
    if (customer.porcentajeCoberturaCatalogo >= 80) return "text-orange-500";
    return "text-red-600";
  }

  getRowBackgroundColor(level: number): string {
    switch (level) {
      case 1:
        return "#dbeafe";
      case 2:
        return "#ecfeff";
      case 3:
        return "#f8fafc";
      case 4:
        return "#fef3c7";
      default:
        return "#ffffff";
    }
  }

  getRowTextColor(level: number): string {
    switch (level) {
      case 1:
        return "#1d4ed8";
      case 2:
        return "#0f766e";
      case 3:
        return "#0f172a";
      case 4:
        return "#b45309";
      default:
        return "#111827";
    }
  }

  formatPercent(value: number): string {
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  getPresencia(
    cuenta: IAutitoriaCuentaAspelCatalogoDTO,
    customerId: string,
  ): IAutitoriaCuentaAspelPresenciaDTO | undefined {
    return cuenta.presencias.find((item) => item.customerId === customerId);
  }

  getPresenceIcon(presencia?: IAutitoriaCuentaAspelPresenciaDTO): string {
    if (!presencia || !presencia.presente) return "mdi:close";
    if (!presencia.estructuraValida) return "mdi:alert";
    return "mdi:check";
  }

  getPresenceColor(presencia?: IAutitoriaCuentaAspelPresenciaDTO): string {
    if (!presencia || !presencia.presente) return "#dc2626";
    if (!presencia.estructuraValida) return "#d97706";
    return "#15803d";
  }

  getPresenceTitle(presencia?: IAutitoriaCuentaAspelPresenciaDTO): string {
    if (!presencia || !presencia.presente)
      return "No existe la cuenta en este customer";
    if (!presencia.estructuraValida) {
      return `La cuenta existe, pero difiere en: ${presencia.camposConDiferencia.join(", ")}`;
    }

    return "La cuenta existe y su estructura coincide";
  }

  formatNaturaleza(value: string): string {
    const normalized = (value ?? "").trim().toUpperCase();
    if (normalized === "D") return "Deudora";
    if (normalized === "A") return "Acreedora";
    return normalized || "-";
  }

  async exportExcel(): Promise<void> {
    await this.exportS.exportCatalogoExcel(
      this.catalogoGeneral(),
      this.customerColumns(),
      this.filterS.year(),
      this.empresaSeleccionada(),
    );
  }

  exportPdf(): void {
    this.exportS.exportCatalogoPdf(
      this.catalogoGeneral(),
      this.customerColumns(),
      this.filterS.year(),
      this.empresaSeleccionada(),
    );
  }

  private filterCatalogo(
    accounts: IAutitoriaCuentaAspelCatalogoDTO[],
    search: string,
    onlyPartials: boolean,
  ): IAutitoriaCuentaAspelCatalogoDTO[] {
    const text = search.trim().toLowerCase();
    let filtered = accounts;

    if (onlyPartials) {
      filtered = filtered.filter(
        (account) =>
          !account.compartidaPorTodos || account.tieneDiferenciaEstructural,
      );
    }

    if (!text) return filtered;

    return filtered.filter((account) => {
      if (
        account.numCta.toLowerCase().includes(text) ||
        account.nombreReferencia.toLowerCase().includes(text)
      ) {
        return true;
      }

      return account.presencias.some(
        (presencia) =>
          presencia.customerShortName.toLowerCase().includes(text) ||
          presencia.customerName.toLowerCase().includes(text) ||
          presencia.camposConDiferencia.some((field) =>
            field.toLowerCase().includes(text),
          ),
      );
    });
  }
}
