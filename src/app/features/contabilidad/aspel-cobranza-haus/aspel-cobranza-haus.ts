import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { MessageModule } from "primeng/message";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  AspelPendienteConceptoItem,
  AspelPendientesConceptoResponse,
  PendientesConceptoRequest,
  SelectItem,
} from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus",
  templateUrl: "./aspel-cobranza-haus.html",
  styleUrls: ["./aspel-cobranza-haus.scss"],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    DatePickerModule,
    MessageModule,
    SelectModule,
    TagModule,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
    CurrencyPipe,
    NgClass,
  ],
})
export class AspelCobranzaHaus {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  customerId = signal<string>("");
  accountOptions = signal<SelectItem<string>[]>([]);
  accountsLoading = signal(false);
  loading = signal(false);
  searched = signal(false);
  summary = signal<AspelPendientesConceptoResponse | null>(null);
  dataSignal = signal<AspelPendienteConceptoItem[]>([]);
  private loadedAccountsYear = signal<number | null>(null);

  request: PendientesConceptoRequest = {
    numCta: "103-008-002-000",
    fechaInicio: new Date(2026, 0, 1),
    fechaFin: new Date(2026, 3, 30),
  };

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data.length) return [];
    return globalFilterFields(data);
  });

  hasCustomerContext = computed(() => !!this.customerId());
  totalSaldoInicial = computed(() =>
    this.dataSignal().reduce((sum, item) => sum + (item.saldoInicial ?? 0), 0),
  );
  totalSaldoPendiente = computed(() =>
    this.dataSignal().reduce((sum, item) => sum + (item.saldoPendiente ?? 0), 0),
  );

  constructor() {
    effect(() => {
      const nextCustomerId = this.customerIdS.customerId();
      if (!nextCustomerId) return;
      if (untracked(() => this.customerId()) !== nextCustomerId) {
        this.customerId.set(nextCustomerId);
      }

      const year = this.getRequestYear();
      if (year) {
        untracked(() => {
          void this.loadAccountOptions(nextCustomerId, year);
        });
      }
    });
  }

  onSearch(): void {
    this.searched.set(true);

    if (!this.canSearch()) {
      this.summary.set(null);
      this.dataSignal.set([]);
      return;
    }

    const fechaInicio = this.formatDate(this.request.fechaInicio!);
    const fechaFin = this.formatDate(this.request.fechaFin!);

    this.loading.set(true);
    this.apiResponseS
      .onGetItem<AspelPendientesConceptoResponse>(
        Endpoints.AspelCobranza.pendientesConceptoRango(
          this.customerId(),
          this.request.numCta.trim(),
          fechaInicio,
          fechaFin,
        ),
      )
      .then((result) => {
        const normalized = result ? this.normalizeResponse(result) : null;
        this.summary.set(normalized);
        this.dataSignal.set(normalized?.conceptos ?? []);
      })
      .finally(() => this.loading.set(false));
  }

  onClear(): void {
    this.request = {
      numCta: "103-008-002-000",
      fechaInicio: new Date(2026, 0, 1),
      fechaFin: new Date(2026, 3, 30),
    };
    this.searched.set(false);
    this.summary.set(null);
    this.dataSignal.set([]);
    const year = this.getRequestYear();
    if (year && this.customerId()) {
      void this.loadAccountOptions(this.customerId(), year, true);
    }
  }

  onDateContextChange(): void {
    const selectedYear = this.getRequestYear();
    if (!selectedYear || this.loadedAccountsYear() === selectedYear) return;
    if (this.customerId()) {
      void this.loadAccountOptions(this.customerId(), selectedYear);
    }
  }

  canSearch(): boolean {
    return (
      this.hasCustomerContext() &&
      !!this.request.numCta.trim() &&
      !!this.request.fechaInicio &&
      !!this.request.fechaFin
    );
  }

  getConceptSeverity(concepto: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    const normalized = concepto.toUpperCase();
    if (normalized.includes("MTTO")) return "info";
    if (normalized.includes("EXTRA")) return "warn";
    if (normalized.includes("RESERVA")) return "success";
    if (normalized.includes("TARJETA")) return "contrast";
    return "secondary";
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return "text-red-600";
    if (balance < 0) return "text-green-600";
    return "text-color";
  }

  private async loadAccountOptions(
    customerId: string,
    year: number,
    forceReload: boolean = false,
  ): Promise<void> {
    if (!forceReload && this.loadedAccountsYear() === year && this.accountOptions().length) return;

    this.accountsLoading.set(true);
    try {
      const options = await this.apiResponseS.onGetItem<SelectItem<string>[]>(
        Endpoints.AspelCobranza.accountsSelect(customerId, year),
      );

      const normalizedOptions = (options ?? []).map((item: any) => ({
        label: item.label ?? item.Label ?? "",
        value: item.value ?? item.Value ?? "",
        isSelected: item.isSelected ?? item.IsSelected ?? null,
        image: item.image ?? item.Image ?? null,
      }));
      this.accountOptions.set(normalizedOptions);
      this.loadedAccountsYear.set(year);

      const hasCurrentValue = normalizedOptions.some(
        (item) => item.value === this.request.numCta,
      );

      if (!hasCurrentValue && normalizedOptions.length) {
        this.request.numCta = normalizedOptions[0].value;
      }
    } finally {
      this.accountsLoading.set(false);
    }
  }

  private getRequestYear(): number | null {
    return this.request.fechaInicio?.getFullYear() ?? null;
  }

  private normalizeResponse(
    response: AspelPendientesConceptoResponse,
  ): AspelPendientesConceptoResponse {
    const conceptos = (response.conceptos ?? []).map((item) => ({
      concepto: item.concepto ?? "",
      numCta: item.numCta ?? item.num_cta ?? "",
      nombreCuenta: item.nombreCuenta ?? item.nombre_cuenta ?? "",
      saldoInicial: item.saldoInicial ?? item.saldo_inicial ?? 0,
      cargos: item.cargos ?? 0,
      abonos: item.abonos ?? 0,
      saldoPendiente: item.saldoPendiente ?? item.saldo_pendiente ?? 0,
    }));

    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      totalConceptos:
        response.totalConceptos ?? response.total_conceptos ?? conceptos.length,
      conceptos,
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
