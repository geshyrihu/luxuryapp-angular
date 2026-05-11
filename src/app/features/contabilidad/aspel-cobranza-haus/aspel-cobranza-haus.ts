import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import { Component, computed, effect, inject, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DatePickerModule } from "primeng/datepicker";
import { MessageModule } from "primeng/message";
import { SelectModule } from "primeng/select";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import {
  AspelAccount,
  AspelAccountsByCustomerResponse,
  AspelContrapartidaGrupo,
  AspelContrapartidaResponse,
  AspelDeudaActualItem,
  AspelDeudasActualesResponse,
  AspelEstadoCuentaResponse,
  AspelMovimiento,
  AspelPendienteConceptoItem,
  AspelPendientesConceptoResponse,
  AspelQueryMode,
  AspelQueryRequest,
  SelectItem,
} from "./aspel-cobranza-haus.models";
import { AspelCobranzaHausDebtDetailModal } from "./aspel-cobranza-haus-debt-detail-modal";

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
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CurrencyPipe,
    NgClass,
  ],
})
export class AspelCobranzaHaus {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  readonly endpointOptions: SelectItem<AspelQueryMode>[] = [
    {
      label: "Catalogo de cuentas",
      value: "accounts",
    },
    {
      label: "Estado de cuenta",
      value: "estado-cuenta-rango",
    },
    {
      label: "Contrapartidas",
      value: "contrapartidas-rango",
    },
    {
      label: "Pendientes por concepto",
      value: "pendientes-concepto-rango",
    },
    {
      label: "Deudas actuales",
      value: "deudas-actuales",
    },
  ];

  customerId = signal<string>("");
  accountOptions = signal<SelectItem<string>[]>([]);
  accountsLoading = signal(false);
  loading = signal(false);
  searched = signal(false);
  mode = signal<AspelQueryMode>("pendientes-concepto-rango");
  rawCatalog = signal<AspelAccount[]>([]);
  estadoCuenta = signal<AspelEstadoCuentaResponse | null>(null);
  contrapartidas = signal<AspelContrapartidaResponse | null>(null);
  pendientes = signal<AspelPendientesConceptoResponse | null>(null);
  deudasActuales = signal<AspelDeudasActualesResponse | null>(null);
  private loadedAccountsYear = signal<number | null>(null);
  private loadedAccountsCustomerId = signal<string>("");

  request: AspelQueryRequest = this.buildDefaultRequest();

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  hasCustomerContext = computed(() => !!this.customerId());
  yearLabel = computed(() => this.getRequestYear()?.toString() ?? "-");
  accountRows = computed(() => this.rawCatalog());
  estadoMovimientos = computed(() => this.estadoCuenta()?.movimientos ?? []);
  contrapartidaRows = computed(() => this.contrapartidas()?.grupos ?? []);
  pendienteRows = computed(() => this.pendientes()?.conceptos ?? []);
  deudaActualRows = computed(() => this.deudasActuales()?.propiedades ?? []);

  activeRows = computed<
    AspelAccount[] | AspelMovimiento[] | AspelContrapartidaGrupo[] | AspelPendienteConceptoItem[] | AspelDeudaActualItem[]
  >(() => {
    const mode = this.mode();
    if (mode === "accounts") return this.accountRows();
    if (mode === "estado-cuenta-rango") return this.estadoMovimientos();
    if (mode === "contrapartidas-rango") return this.contrapartidaRows();
    if (mode === "deudas-actuales") return this.deudaActualRows();
    return this.pendienteRows();
  });

  globalFilterFields = computed(() => {
    const data = this.activeRows();
    if (!data.length) return [];
    return globalFilterFields(data);
  });

  totalSaldoInicialPendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.saldoInicial ?? 0), 0),
  );
  totalCargosPendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.cargos ?? 0), 0),
  );
  totalAbonosPendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.abonos ?? 0), 0),
  );
  totalSaldoPendientePendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.saldoPendiente ?? 0), 0),
  );
  totalDeudaActual = computed(() => this.deudasActuales()?.totalDeudaActual ?? 0);

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
          const shouldForceReload =
            this.loadedAccountsCustomerId() !== nextCustomerId;
          void this.loadAccountOptions(nextCustomerId, year, shouldForceReload);
        });
      }
    });
  }

  onSearch(): void {
    this.searched.set(true);

    if (!this.canSearch()) {
      this.clearResults();
      return;
    }

    this.loading.set(true);
    void this.runQuery().finally(() => this.loading.set(false));
  }

  onClear(): void {
    this.request = this.buildDefaultRequest();
    this.mode.set("pendientes-concepto-rango");
    this.searched.set(false);
    this.clearResults();

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

  onModeChange(): void {
    this.clearResults();
    this.searched.set(false);
  }

  canSearch(): boolean {
    const mode = this.mode();
    if (!this.hasCustomerContext()) return false;
    if (mode === "accounts") return this.getRequestYear() !== null;
    if (mode === "deudas-actuales") return true;

    return (
      !!this.request.numCta.trim() &&
      !!this.request.fechaInicio &&
      !!this.request.fechaFin
    );
  }

  canDownloadAccountDocuments(): boolean {
    const mode = this.mode();
    if (!this.hasCustomerContext()) return false;
    if (mode === "accounts" || mode === "deudas-actuales") return false;

    return (
      !!this.request.numCta.trim() &&
      !!this.request.fechaInicio &&
      !!this.request.fechaFin
    );
  }

  getModeTitle(): string {
    switch (this.mode()) {
      case "accounts":
        return "Catalogo de Cuentas Aspel";
      case "estado-cuenta-rango":
        return "Estado de Cuenta Aspel";
      case "contrapartidas-rango":
        return "Contrapartidas Aspel";
      case "deudas-actuales":
        return "Deudas Actuales Aspel";
      default:
        return "Pendientes por Concepto Aspel";
    }
  }

  getModeDescription(): string {
    switch (this.mode()) {
      case "accounts":
        return "Consulta el catalogo de cuentas disponible para el customer y ejercicio seleccionados.";
      case "estado-cuenta-rango":
        return "Consulta movimientos y saldo progresivo de una cuenta en un rango libre.";
      case "contrapartidas-rango":
        return "Agrupa contrapartidas 401 relacionadas con la cuenta base.";
      case "deudas-actuales":
        return "Lista las propiedades del customer con deuda vigente y permite abrir el detalle pendiente en modal.";
      default:
        return "Consulta saldos pendientes por concepto desde cuentas directas o subcuentas nivel 4.";
    }
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

  private async runQuery(): Promise<void> {
    const customerId = this.customerId();
    const mode = this.mode();
    const year = this.getRequestYear();
    const fechaInicio = this.formatDate(this.request.fechaInicio!);
    const fechaFin = this.formatDate(this.request.fechaFin!);
    const numCta = this.request.numCta.trim();

    this.clearResults();

    if (mode === "accounts") {
      if (!year) return;
      const result = await this.apiResponseS.onGetItem<AspelAccountsByCustomerResponse>(
        Endpoints.AspelCobranza.accounts(customerId, year),
      );
      const normalized = result ? this.normalizeAccountsResponse(result) : null;
      this.rawCatalog.set(normalized?.cuentas ?? []);
      return;
    }

    if (mode === "estado-cuenta-rango") {
      const result = await this.apiResponseS.onGetItem<AspelEstadoCuentaResponse>(
        Endpoints.AspelCobranza.estadoCuentaRango(
          customerId,
          numCta,
          fechaInicio,
          fechaFin,
        ),
      );
      this.estadoCuenta.set(result ? this.normalizeEstadoCuentaResponse(result) : null);
      return;
    }

    if (mode === "contrapartidas-rango") {
      const result = await this.apiResponseS.onGetItem<AspelContrapartidaResponse>(
        Endpoints.AspelCobranza.contrapartidasRango(
          customerId,
          numCta,
          fechaInicio,
          fechaFin,
        ),
      );
      this.contrapartidas.set(
        result ? this.normalizeContrapartidasResponse(result) : null,
      );
      return;
    }

    if (mode === "deudas-actuales") {
      const result = await this.apiResponseS.onGetItem<AspelDeudasActualesResponse>(
        Endpoints.AspelCobranza.deudasActuales(customerId),
      );
      this.deudasActuales.set(
        result ? this.normalizeDeudasActualesResponse(result) : null,
      );
      return;
    }

    const result = await this.apiResponseS.onGetItem<AspelPendientesConceptoResponse>(
      Endpoints.AspelCobranza.pendientesConceptoRango(
        customerId,
        numCta,
        fechaInicio,
        fechaFin,
      ),
    );
    this.pendientes.set(result ? this.normalizePendientesResponse(result) : null);
  }

  private clearResults(): void {
    this.rawCatalog.set([]);
    this.estadoCuenta.set(null);
    this.contrapartidas.set(null);
    this.pendientes.set(null);
    this.deudasActuales.set(null);
  }

  async openDebtDetail(row: AspelDeudaActualItem): Promise<void> {
    const today = new Date();
    const currentYearStart = `${today.getFullYear()}-01-01`;
    const currentDate = this.formatDate(today);

    await this.dialogHandlerS.openDialog(
      AspelCobranzaHausDebtDetailModal,
      {
        row,
        customerId: this.customerId(),
        fechaInicio: currentYearStart,
        fechaFin: currentDate,
      },
      `Detalle deuda · ${row.numCtaBase}`,
      this.dialogHandlerS.sizeLg,
    );
  }

  downloadAvisoCobroPdf(): void {
    if (!this.canDownloadAccountDocuments()) return;

    const fechaInicio = this.formatDate(this.request.fechaInicio!);
    const fechaFin = this.formatDate(this.request.fechaFin!);
    const numCta = this.request.numCta.trim();

    this.apiResponseS.onDownloadFile(
      Endpoints.AspelCobranza.avisoCobroPdf(
        this.customerId(),
        numCta,
        fechaInicio,
        fechaFin,
      ),
      `Aviso-Cobro-${numCta}-${fechaFin}.pdf`,
    );
  }

  downloadEstadoCuentaPdf(): void {
    if (!this.canDownloadAccountDocuments()) return;

    const fechaInicio = this.formatDate(this.request.fechaInicio!);
    const fechaFin = this.formatDate(this.request.fechaFin!);
    const numCta = this.request.numCta.trim();

    this.apiResponseS.onDownloadFile(
      Endpoints.AspelCobranza.estadoCuentaPdf(
        this.customerId(),
        numCta,
        fechaInicio,
        fechaFin,
      ),
      `Estado-Cuenta-${numCta}-${fechaFin}.pdf`,
    );
  }

  private async loadAccountOptions(
    customerId: string,
    year: number,
    forceReload: boolean = false,
  ): Promise<void> {
    if (
      !forceReload &&
      this.loadedAccountsYear() === year &&
      this.loadedAccountsCustomerId() === customerId &&
      this.accountOptions().length
    ) {
      return;
    }

    this.accountsLoading.set(true);
    try {
      const response = await this.apiResponseS.onGetItem<AspelAccountsByCustomerResponse>(
        Endpoints.AspelCobranza.accounts(customerId, year),
      );
      const normalizedResponse = response
        ? this.normalizeAccountsResponse(response)
        : null;

      const normalizedOptions = (normalizedResponse?.cuentas ?? []).map((item) => ({
        label: `${item.numCta} - ${item.nombre}`,
        value: item.numCta,
        isSelected: null,
        image: null,
      }));

      this.accountOptions.set(normalizedOptions);
      this.loadedAccountsYear.set(year);
      this.loadedAccountsCustomerId.set(customerId);

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

  private buildDefaultRequest(): AspelQueryRequest {
    const today = new Date();
    const currentYear = today.getFullYear();

    return {
      numCta: "",
      fechaInicio: new Date(currentYear, 0, 1),
      fechaFin: new Date(currentYear, today.getMonth(), today.getDate()),
    };
  }

  private normalizeAccountsResponse(
    response: AspelAccountsByCustomerResponse,
  ): AspelAccountsByCustomerResponse {
    return {
      customerId: response.customerId ?? "",
      totalCondominos: response.totalCondominos ?? response.cuentas?.length ?? 0,
      cuentas: (response.cuentas ?? []).map((item) => ({
        numCta: item.numCta ?? "",
        nombre: item.nombre ?? "",
        estatus: item.estatus ?? "",
      })),
    };
  }

  private normalizeEstadoCuentaResponse(
    response: AspelEstadoCuentaResponse,
  ): AspelEstadoCuentaResponse {
    return {
      numCta: response.numCta ?? response.num_cta ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_Inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_Fin ?? "",
      saldoInicial: response.saldoInicial ?? response.saldo_Inicial ?? 0,
      saldoFinal: response.saldoFinal ?? response.saldo_Final ?? 0,
      totalMovimientos:
        response.totalMovimientos ?? response.total_Movimientos ?? response.movimientos?.length ?? 0,
      saldosFinalesPorConcepto:
        response.saldosFinalesPorConcepto ?? response.saldos_finales_por_concepto ?? [],
      movimientos: (response.movimientos ?? []).map((item) => ({
        id: item.id ?? "",
        fecha: item.fecha ?? "",
        tipo: item.tipo ?? "",
        concepto: item.concepto ?? "",
        monto: item.monto ?? 0,
        saldoAnterior: item.saldoAnterior ?? item.saldo_Anterior ?? 0,
        saldoPosterior: item.saldoPosterior ?? item.saldo_Posterior ?? 0,
      })),
    };
  }

  private normalizeContrapartidasResponse(
    response: AspelContrapartidaResponse,
  ): AspelContrapartidaResponse {
    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      saldoInicial: response.saldoInicial ?? response.saldo_Inicial ?? 0,
      saldoFinal: response.saldoFinal ?? response.saldo_Final ?? 0,
      totalMovimientos:
        response.totalMovimientos ?? response.total_movimientos ?? 0,
      saldosFinalesPorConcepto:
        response.saldosFinalesPorConcepto ?? response.saldos_finales_por_concepto ?? [],
      grupos: (response.grupos ?? []).map((group) => ({
        numCtaContra: group.numCtaContra ?? group.num_cta_contra ?? "",
        nombreCuenta: group.nombreCuenta ?? group.nombre_cuenta ?? "",
        totalMonto: group.totalMonto ?? group.total_monto ?? 0,
        totalMovimientos: group.totalMovimientos ?? group.total_movimientos ?? 0,
        movimientos: (group.movimientos ?? []).map((item) => ({
          id: item.id ?? "",
          fecha: item.fecha ?? "",
          concepto: item.concepto ?? "",
          monto: item.monto ?? 0,
          tipo: item.tipo ?? "",
        })),
      })),
    };
  }

  private normalizePendientesResponse(
    response: AspelPendientesConceptoResponse,
  ): AspelPendientesConceptoResponse {
    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      totalConceptos:
        response.totalConceptos ?? response.total_conceptos ?? response.conceptos?.length ?? 0,
      conceptos: (response.conceptos ?? []).map((item) => ({
        concepto: item.concepto ?? "",
        numCta: item.numCta ?? item.num_cta ?? "",
        nombreCuenta: item.nombreCuenta ?? item.nombre_cuenta ?? "",
        saldoInicial: item.saldoInicial ?? item.saldo_inicial ?? 0,
        cargos: item.cargos ?? 0,
        abonos: item.abonos ?? 0,
        saldoPendiente: item.saldoPendiente ?? item.saldo_pendiente ?? 0,
      })),
    };
  }

  private normalizeDeudasActualesResponse(
    response: AspelDeudasActualesResponse,
  ): AspelDeudasActualesResponse {
    return {
      customerId: response.customerId ?? response.customer_id ?? "",
      fechaCorte: response.fechaCorte ?? response.fecha_corte ?? "",
      totalPropiedadesConDeuda:
        response.totalPropiedadesConDeuda ??
        response.total_propiedades_con_deuda ??
        response.propiedades?.length ??
        0,
      totalDeudaActual:
        response.totalDeudaActual ?? response.total_deuda_actual ?? 0,
      propiedades: (response.propiedades ?? []).map((item) => ({
        numCtaBase: item.numCtaBase ?? item.num_cta_base ?? "",
        departamento: item.departamento ?? "",
        saldoActual: item.saldoActual ?? item.saldo_actual ?? 0,
        tieneDesgloseConceptos:
          item.tieneDesgloseConceptos ?? item.tiene_desglose_conceptos ?? false,
        totalConceptos: item.totalConceptos ?? item.total_conceptos ?? 0,
      })),
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
