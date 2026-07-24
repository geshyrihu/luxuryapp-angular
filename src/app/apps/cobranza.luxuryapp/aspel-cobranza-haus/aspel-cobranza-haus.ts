import { CommonModule, CurrencyPipe, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { FormsModule } from "@angular/forms";

import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { LxCard } from "@ui/adaptive/card/card";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelDownload } from "@ui/buttons/web-label/button-download";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AspelCobranzaHausDebtDetailModal } from "./aspel-cobranza-haus-debt-detail-modal";
import { AspelCobranzaHausPdfService } from "./aspel-cobranza-haus-pdf.service";
import { AspelCobranzaHausQueryPanel } from "./aspel-cobranza-haus-query-panel";
import { AspelCobranzaHausSourceToolbar } from "./aspel-cobranza-haus-source-toolbar";
import {
  AspelAccount,
  AspelAccountsByCustomerResponse,
  AspelCobranzaDetalleConcepto,
  AspelCobranzaDetalleResponse,
  AspelContrapartidaGrupo,
  AspelContrapartidaResponse,
  AspelDataSource,
  AspelDeudaActualItem,
  AspelDeudasActualesResponse,
  AspelEstadoCuentaResponse,
  AspelLocalStatusResponse,
  AspelMovimiento,
  AspelPendienteConceptoItem,
  AspelPendientesConceptoResponse,
  AspelQueryMode,
  AspelQueryRequest,
  SelectItem,
} from "./aspel-cobranza-haus.models";

@Component({
  selector: "app-aspel-cobranza-haus",
  templateUrl: "./aspel-cobranza-haus.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    AppIcon,
    WebButtonLabelDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    AspelCobranzaHausSourceToolbar,
    AspelCobranzaHausQueryPanel,
    CurrencyPipe,
    NgClass,
    LxTag,
    LxCard,
    LxMessage,
  ],
})
export class AspelCobranzaHaus {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly cobranzaPdfS = inject(AspelCobranzaHausPdfService);
  private readonly tableScrollHeightS = inject(TableScrollHeightService);
  // private readonly aspelSyncS = inject(AspelSyncService);

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
      label: "Aviso de cobro",
      value: "detalle-cobranza-rango",
    },
    {
      label: "Deudas actuales",
      value: "deudas-actuales",
    },
  ];

  readonly dataSourceOptions: SelectItem<AspelDataSource>[] = [
    {
      label: "Live",
      value: "live",
    },
    {
      label: "Local",
      value: "local",
    },
  ];

  customerId = signal<string>("");
  accountOptions = signal<SelectItem<string>[]>([]);
  accountsLoading = signal(false);
  loading = signal(false);
  syncLoading = signal(false);
  localStatusLoading = signal(false);
  searched = signal(false);
  mode = signal<AspelQueryMode>("deudas-actuales");
  dataSource = signal<AspelDataSource>("live");
  rawCatalog = signal<AspelAccount[]>([]);
  estadoCuenta = signal<AspelEstadoCuentaResponse | null>(null);
  detalleCobranza = signal<AspelCobranzaDetalleResponse | null>(null);
  contrapartidas = signal<AspelContrapartidaResponse | null>(null);
  pendientes = signal<AspelPendientesConceptoResponse | null>(null);
  deudasActuales = signal<AspelDeudasActualesResponse | null>(null);
  localStatus = signal<AspelLocalStatusResponse | null>(null);
  private loadedAccountsYear = signal<number | null>(null);
  private loadedAccountsCustomerId = signal<string>("");
  private loadedAccountsSource = signal<AspelDataSource | null>(null);

  request: AspelQueryRequest = this.buildDefaultRequest();

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  hasCustomerContext = computed(() => !!this.customerId());
  sourceLabel = computed(() =>
    this.dataSource() === "local" ? "snapshot local" : "Aspel live",
  );
  syncYear = computed(() => this.getSyncYear());
  yearLabel = computed(() => this.getContextYear()?.toString() ?? "-");
  accountRows = computed(() => this.rawCatalog());
  estadoMovimientos = computed(() => this.estadoCuenta()?.movimientos ?? []);
  detalleConceptRows = computed(() => this.detalleCobranza()?.conceptos ?? []);
  contrapartidaRows = computed(() => this.contrapartidas()?.grupos ?? []);
  pendienteRows = computed(() => this.pendientes()?.conceptos ?? []);
  deudaActualRows = computed(() => this.deudasActuales()?.propiedades ?? []);

  activeRows = computed<
    | AspelAccount[]
    | AspelMovimiento[]
    | AspelCobranzaDetalleConcepto[]
    | AspelContrapartidaGrupo[]
    | AspelPendienteConceptoItem[]
    | AspelDeudaActualItem[]
  >(() => {
    const mode = this.mode();
    if (mode === "accounts") return this.accountRows();
    if (mode === "estado-cuenta-rango") return this.estadoMovimientos();
    if (mode === "detalle-cobranza-rango") return this.detalleConceptRows();
    if (mode === "deudas-actuales") return this.deudaActualRows();
    return this.pendienteRows();
  });

  globalFilterFields = computed(() => {
    const data = this.activeRows();
    if (!data.length) return [];
    return globalFilterFields(data);
  });

  totalSaldoInicialPendientes = computed(() =>
    this.pendienteRows().reduce(
      (sum, item) => sum + (item.saldoInicial ?? 0),
      0,
    ),
  );
  totalCargosPendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.cargos ?? 0), 0),
  );
  totalAbonosPendientes = computed(() =>
    this.pendienteRows().reduce((sum, item) => sum + (item.abonos ?? 0), 0),
  );
  totalSaldoPendientePendientes = computed(() =>
    this.pendienteRows().reduce(
      (sum, item) => sum + (item.saldoPendiente ?? 0),
      0,
    ),
  );
  totalDeudaActual = computed(
    () => this.deudasActuales()?.totalDeudaActual ?? 0,
  );

  constructor() {
    effect(() => {
      const nextCustomerId = this.customerIdS.customerId();
      if (!nextCustomerId) return;

      if (untracked(() => this.customerId()) !== nextCustomerId) {
        this.customerId.set(nextCustomerId);
      }

      untracked(() => {
        /*
        const shouldRefreshLocalStatus =
          this.localStatus()?.customerId !== nextCustomerId;

        if (shouldRefreshLocalStatus) {
          void this.refreshLocalStatus();
        }
        */
      });

      const year = this.getContextYear();
      if (year) {
        untracked(() => {
          const shouldForceReload =
            this.loadedAccountsCustomerId() !== nextCustomerId ||
            this.loadedAccountsSource() !== this.dataSource();
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
    this.mode.set("deudas-actuales");
    this.searched.set(false);
    this.clearResults();

    const year = this.getContextYear();
    if (year && this.customerId()) {
      void this.loadAccountOptions(this.customerId(), year, true);
    }
  }

  onDateContextChange(): void {
    const selectedYear = this.getContextYear();
    if (!selectedYear || this.loadedAccountsYear() === selectedYear) return;
    if (this.customerId()) {
      void this.loadAccountOptions(this.customerId(), selectedYear);
    }
  }

  onModeChange(nextMode?: AspelQueryMode): void {
    if (nextMode) {
      this.mode.set(nextMode);
    }

    this.clearResults();
    this.searched.set(false);
  }

  onDataSourceChange(nextSource: AspelDataSource): void {
    if (this.dataSource() === nextSource) return;

    this.dataSource.set(nextSource);
    this.clearResults();
    this.searched.set(false);
    this.accountOptions.set([]);
    this.loadedAccountsYear.set(null);
    this.loadedAccountsCustomerId.set("");
    this.loadedAccountsSource.set(null);

    const year = this.getContextYear();
    if (year && this.customerId()) {
      void this.loadAccountOptions(this.customerId(), year, true);
    }

    /*
    if (this.customerId()) {
      void this.refreshLocalStatus();
    }
    */
  }

  canSearch(): boolean {
    const mode = this.mode();
    const numCta = this.getNormalizedNumCta();
    if (!this.hasCustomerContext()) return false;
    if (mode === "accounts") return this.getContextYear() !== null;
    if (mode === "deudas-actuales") return true;
    if (mode === "detalle-cobranza-rango") return !!numCta;

    return !!numCta && !!this.request.fechaInicio && !!this.request.fechaFin;
  }

  canDownloadAccountDocuments(): boolean {
    const mode = this.mode();
    const numCta = this.getNormalizedNumCta();
    if (!this.hasCustomerContext()) return false;
    if (mode === "accounts" || mode === "deudas-actuales") return false;
    if (mode === "detalle-cobranza-rango") return !!numCta;
    return !!numCta && !!this.request.fechaInicio && !!this.request.fechaFin;
  }

  getModeTitle(): string {
    const sourceSuffix = this.dataSource() === "local" ? "Local" : "Live";

    switch (this.mode()) {
      case "accounts":
        return `Catalogo de Cuentas ${sourceSuffix}`;
      case "estado-cuenta-rango":
        return `Estado de Cuenta ${sourceSuffix}`;
      case "detalle-cobranza-rango":
        return `Detalle de Cobranza ${sourceSuffix}`;
      case "deudas-actuales":
        return `Deudas Actuales ${sourceSuffix}`;
      default:
        return `Pendientes por Concepto ${sourceSuffix}`;
    }
  }

  getModeDescription(): string {
    switch (this.mode()) {
      case "accounts":
        return `Consulta el catalogo de cuentas disponible para el customer y ejercicio seleccionados desde ${this.sourceLabel()}.`;
      case "estado-cuenta-rango":
        return `Consulta movimientos y saldo progresivo de una cuenta en un rango libre usando ${this.sourceLabel()}.`;
      case "detalle-cobranza-rango":
        return `Consulta la deuda aplicada por concepto y agrupa abonos por recibo para lectura de cobranza usando ${this.sourceLabel()}.`;
      case "deudas-actuales":
        return `Lista las propiedades del customer con deuda vigente y permite abrir el detalle pendiente en modal usando ${this.sourceLabel()}.`;
      default:
        return `Consulta saldos pendientes por concepto desde cuentas directas o subcuentas nivel 4 usando ${this.sourceLabel()}.`;
    }
  }

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
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
    const year = this.getContextYear();
    const fechaInicio = this.request.fechaInicio
      ? this.formatDate(this.request.fechaInicio)
      : null;
    const fechaFin = this.request.fechaFin
      ? this.formatDate(this.request.fechaFin)
      : null;
    const numCta = this.getNormalizedNumCta();

    this.clearResults();

    if (mode === "accounts") {
      if (!year) return;
      const result =
        await this.apiResponseS.onGetItem<AspelAccountsByCustomerResponse>(
          this.getAccountsEndpoint(customerId, year),
        );
      const normalized = result ? this.normalizeAccountsResponse(result) : null;
      this.rawCatalog.set(normalized?.cuentas ?? []);
      return;
    }

    if (mode === "estado-cuenta-rango") {
      if (!fechaInicio || !fechaFin || !numCta) return;
      const result =
        await this.apiResponseS.onGetItem<AspelEstadoCuentaResponse>(
          this.getEstadoCuentaEndpoint(
            customerId,
            numCta,
            fechaInicio,
            fechaFin,
          ),
        );
      this.estadoCuenta.set(
        result ? this.normalizeEstadoCuentaResponse(result) : null,
      );
      return;
    }

    if (mode === "detalle-cobranza-rango") {
      if (!numCta) return;
      const result =
        await this.apiResponseS.onGetItem<AspelCobranzaDetalleResponse>(
          this.getDetalleCobranzaEndpoint(customerId, numCta),
        );
      this.detalleCobranza.set(
        result ? this.normalizeDetalleCobranzaResponse(result) : null,
      );
      return;
    }

    if (mode === "deudas-actuales") {
      const result =
        await this.apiResponseS.onGetItem<AspelDeudasActualesResponse>(
          this.getDeudasActualesEndpoint(customerId),
        );
      this.deudasActuales.set(
        result ? this.normalizeDeudasActualesResponse(result) : null,
      );
    }
  }

  private clearResults(): void {
    this.rawCatalog.set([]);
    this.estadoCuenta.set(null);
    this.detalleCobranza.set(null);
    this.contrapartidas.set(null);
    this.pendientes.set(null);
    this.deudasActuales.set(null);
  }

  async openDebtDetail(row: AspelDeudaActualItem): Promise<void> {
    const today = new Date();
    const currentDate = this.formatDate(today);

    await this.dialogHandlerS.openDialog(
      AspelCobranzaHausDebtDetailModal,
      {
        row,
        customerId: this.customerId(),
        fechaFin: currentDate,
      },
      `Detalle deuda · ${row.numCtaBase}`,
      this.dialogHandlerS.sizeLg,
    );
  }

  async downloadAvisoCobroPdf(): Promise<void> {
    if (!this.canDownloadAccountDocuments()) return;

    this.loading.set(true);
    try {
      const detalle = await this.getDetalleCobranzaForAviso();
      if (!detalle) return;
      this.cobranzaPdfS.downloadAvisoCobro(detalle, new Date());
    } finally {
      this.loading.set(false);
    }
  }

  async downloadAvisoCobroPdfAspel(): Promise<void> {
    if (!this.canDownloadAccountDocuments()) return;

    this.loading.set(true);
    try {
      const detalle = await this.getDetalleCobranzaForAviso();
      if (!detalle) return;
      await this.cobranzaPdfS.downloadAvisoCobroAspel(detalle, new Date());
    } finally {
      this.loading.set(false);
    }
  }

  async downloadEstadoCuentaPdf(): Promise<void> {
    if (!this.canDownloadAccountDocuments()) return;

    this.loading.set(true);
    try {
      const estado = await this.getEstadoCuentaForPdf();
      if (!estado) return;
      await this.cobranzaPdfS.downloadEstadoCuenta(estado, new Date());
    } finally {
      this.loading.set(false);
    }
  }

  async downloadEstadoCuentaPdfAspel(): Promise<void> {
    if (!this.canDownloadAccountDocuments()) return;

    this.loading.set(true);
    try {
      const estado = await this.getEstadoCuentaForPdf();
      if (!estado) return;
      await this.cobranzaPdfS.downloadEstadoCuentaAspel(estado, new Date());
    } finally {
      this.loading.set(false);
    }
  }

  async syncCobranzaSnapshot(): Promise<void> {
    /*
    await this.runSyncAction(() =>
      this.aspelSyncS.syncCobranza(this.customerId(), this.getSyncYear()),
    );
    */
  }

  async syncCompleteSnapshot(): Promise<void> {
    /*
    await this.runSyncAction(() =>
      this.aspelSyncS.syncCompleto(this.customerId(), this.getSyncYear()),
    );
    */
  }

  async refreshLocalStatus(): Promise<void> {
    /*
    const customerId = this.customerId();
    if (!customerId) return;

    this.localStatusLoading.set(true);
    try {
      const status =
        await this.apiResponseS.onGetItem<AspelLocalStatusResponse>(
          Endpoints.CobranzaLocal.status(customerId, this.getSyncYear()),
        );
      this.localStatus.set(status);
    } finally {
      this.localStatusLoading.set(false);
    }
    */
  }

  private async runSyncAction(runner: () => Promise<any>): Promise<void> {
    /*
    const customerId = this.customerId();
    if (!customerId) return;

    this.syncLoading.set(true);
    try {
      const result = await runner();
      if (result) {
        this.dialogHandlerS.showSuccess("Sincronización completada con éxito");
        void this.refreshLocalStatus();
        this.onClear();
      }
    } finally {
      this.syncLoading.set(false);
    }
    */
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
      this.loadedAccountsSource() === this.dataSource() &&
      this.accountOptions().length
    ) {
      return;
    }

    this.accountsLoading.set(true);
    try {
      const response =
        await this.apiResponseS.onGetItem<AspelAccountsByCustomerResponse>(
          this.getAccountsEndpoint(customerId, year),
        );
      const normalizedResponse = response
        ? this.normalizeAccountsResponse(response)
        : null;

      const normalizedOptions = (normalizedResponse?.cuentas ?? []).map(
        (item) => ({
          label: `${item.numCta} - ${item.nombre}`,
          value: item.numCta,
          isSelected: null,
          image: null,
        }),
      );

      this.accountOptions.set(normalizedOptions);
      this.loadedAccountsYear.set(year);
      this.loadedAccountsCustomerId.set(customerId);
      this.loadedAccountsSource.set(this.dataSource());

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

  private getContextYear(): number | null {
    if (this.mode() === "detalle-cobranza-rango") {
      return new Date().getFullYear();
    }

    return this.request.fechaInicio?.getFullYear() ?? null;
  }

  private getSyncYear(): number {
    return this.getContextYear() ?? new Date().getFullYear();
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
      totalCondominos:
        response.totalCondominos ?? response.cuentas?.length ?? 0,
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
      fechaInicio:
        response.fechaInicio ??
        response.fecha_inicio ??
        response.fecha_Inicio ??
        "",
      fechaFin:
        response.fechaFin ?? response.fecha_fin ?? response.fecha_Fin ?? "",
      saldoInicial:
        response.saldoInicial ??
        response.saldo_inicial ??
        response.saldo_Inicial ??
        0,
      saldoFinal:
        response.saldoFinal ??
        response.saldo_final ??
        response.saldo_Final ??
        0,
      movimientos: (response.movimientos ?? []).map((item) => ({
        id: item.id ?? "",
        numCta: item.numCta ?? item.num_cta ?? "",
        fecha: item.fecha ?? "",
        tipo: item.tipo ?? "",
        concepto: item.concepto ?? "",
        monto: item.monto ?? 0,
        saldoAnterior: item.saldoAnterior ?? item.saldo_anterior ?? 0,
        saldoPosterior: item.saldoPosterior ?? item.saldo_posterior ?? 0,
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
        response.saldosFinalesPorConcepto ??
        response.saldos_finales_por_concepto ??
        [],
      grupos: (response.grupos ?? []).map((group) => ({
        numCtaContra: group.numCtaContra ?? group.num_cta_contra ?? "",
        nombreCuenta: group.nombreCuenta ?? group.nombre_cuenta ?? "",
        totalMonto: group.totalMonto ?? group.total_monto ?? 0,
        totalMovimientos:
          group.totalMovimientos ?? group.total_movimientos ?? 0,
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

  private normalizeDetalleCobranzaResponse(
    response: AspelCobranzaDetalleResponse,
  ): AspelCobranzaDetalleResponse {
    return {
      numCtaBase: response.numCtaBase ?? response.num_cta_base ?? "",
      departamento: response.departamento ?? "",
      fechaInicio: response.fechaInicio ?? response.fecha_inicio ?? "",
      fechaFin: response.fechaFin ?? response.fecha_fin ?? "",
      saldoInicialTotal:
        response.saldoInicialTotal ?? response.saldo_inicial_total ?? 0,
      totalCargos: response.totalCargos ?? response.total_cargos ?? 0,
      totalAbonos: response.totalAbonos ?? response.total_abonos ?? 0,
      saldoFinalTotal:
        response.saldoFinalTotal ?? response.saldo_final_total ?? 0,
      totalAdelantos: response.totalAdelantos ?? response.total_adelantos ?? 0,
      totalConceptos: response.totalConceptos ?? response.total_conceptos ?? 0,
      conceptos: (response.conceptos ?? []).map(
        (item): AspelCobranzaDetalleConcepto => ({
          numCta: item.numCta ?? item.num_cta ?? "",
          nombreCuenta: item.nombreCuenta ?? item.nombre_cuenta ?? "",
          concepto: item.concepto ?? "",
          saldoInicial: item.saldoInicial ?? item.saldo_inicial ?? 0,
          cargos: item.cargos ?? 0,
          abonos: item.abonos ?? 0,
          saldoFinal: item.saldoFinal ?? item.saldo_final ?? 0,
          totalVencido: item.totalVencido ?? item.total_vencido ?? 0,
          adelanto: item.adelanto ?? 0,
          vencidos: (item.vencidos ?? []).map((v) => ({
            fechaCargo: v.fechaCargo ?? v.fecha_cargo ?? "",
            conceptoDetalle: v.conceptoDetalle ?? v.concepto_detalle ?? "",
            saldoPendiente: v.saldoPendiente ?? v.saldo_pendiente ?? 0,
          })),
        }),
      ),
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
        response.totalConceptos ??
        response.total_conceptos ??
        response.conceptos?.length ??
        0,
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

  private async getDetalleCobranzaForAviso(): Promise<AspelCobranzaDetalleResponse | null> {
    const existing = this.detalleCobranza();
    const numCta = this.getNormalizedNumCta();
    if (!numCta) return null;

    if (existing && existing.numCtaBase === numCta) {
      return existing;
    }

    const customerId = this.customerId();

    const result =
      await this.apiResponseS.onGetItem<AspelCobranzaDetalleResponse>(
        this.getDetalleCobranzaEndpoint(customerId, numCta),
      );

    const normalized = result
      ? this.normalizeDetalleCobranzaResponse(result)
      : null;
    this.detalleCobranza.set(normalized);
    return normalized;
  }

  private async getEstadoCuentaForPdf(): Promise<AspelEstadoCuentaResponse | null> {
    const existing = this.estadoCuenta();
    if (existing && this.matchesEstadoCuentaRequest(existing)) {
      return existing;
    }

    const customerId = this.customerId();
    const numCta = this.getNormalizedNumCta();
    if (!numCta || !this.request.fechaInicio || !this.request.fechaFin)
      return null;

    const fechaInicio = this.formatDate(this.request.fechaInicio);
    const fechaFin = this.formatDate(this.request.fechaFin);

    const result = await this.apiResponseS.onGetItem<AspelEstadoCuentaResponse>(
      this.getEstadoCuentaEndpoint(customerId, numCta, fechaInicio, fechaFin),
    );

    const normalized = result
      ? this.normalizeEstadoCuentaResponse(result)
      : null;
    this.estadoCuenta.set(normalized);
    return normalized;
  }

  private matchesEstadoCuentaRequest(data: AspelEstadoCuentaResponse): boolean {
    const numCta = this.getNormalizedNumCta();
    if (!numCta || !this.request.fechaInicio || !this.request.fechaFin)
      return false;

    return (
      data.numCta === numCta &&
      data.fechaInicio === this.formatDate(this.request.fechaInicio) &&
      data.fechaFin === this.formatDate(this.request.fechaFin)
    );
  }

  private getNormalizedNumCta(): string {
    return (this.request.numCta ?? "").trim();
  }

  private getAccountsEndpoint(customerId: string, year: number): string {
    return this.dataSource() === "local"
      ? Endpoints.CobranzaLocal.accounts(customerId, year)
      : Endpoints.CobranzaLive.accounts(customerId, year);
  }

  private getEstadoCuentaEndpoint(
    customerId: string,
    numCta: string,
    fechaInicio: string,
    fechaFin: string,
  ): string {
    return this.dataSource() === "local"
      ? Endpoints.CobranzaLocal.estadoCuentaRango(
          customerId,
          numCta,
          fechaInicio,
          fechaFin,
        )
      : Endpoints.CobranzaLive.estadoCuentaRango(
          customerId,
          numCta,
          fechaInicio,
          fechaFin,
        );
  }

  private getDetalleCobranzaEndpoint(
    customerId: string,
    numCta: string,
  ): string {
    return this.dataSource() === "local"
      ? Endpoints.CobranzaLocal.detalleCobranzaRango(customerId, numCta)
      : Endpoints.CobranzaLive.detalleCobranzaRango(customerId, numCta);
  }

  private getDeudasActualesEndpoint(customerId: string): string {
    return this.dataSource() === "local"
      ? Endpoints.CobranzaLocal.deudasActuales(customerId)
      : Endpoints.CobranzaLive.deudasActuales(customerId);
  }
}
