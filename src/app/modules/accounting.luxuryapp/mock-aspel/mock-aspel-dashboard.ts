import { CommonModule, DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { InputSelect } from "src/app/shared/ui/inputs/adaptive/input-select/input-select";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { EstadoDeCuentaResponse, MockAspelService, MockAspelSyncCustomer, MovimientoFilterOption, MovimientoResponse, PagedResponse, SaldoResponse } from "./services/mock-aspel.service";

@Component({
  selector: "app-mock-aspel-dashboard",
  imports: [CommonModule, DecimalPipe, FormsModule, ReactiveFormsModule, RouterLink, LxCard, WebButtonLabel, InputSelect, AppIcon],
  templateUrl: "./mock-aspel-dashboard.html",
  styleUrl: "./mock-aspel-dashboard.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockAspelDashboardComponent implements OnInit {
  private readonly mockAspelS = inject(MockAspelService);

  readonly activeView = signal<"budget" | "ledger">("budget");
  readonly currentYear = new Date().getFullYear();
  readonly year = signal(this.currentYear);
  readonly period = signal(new Date().getMonth() + 1);
  readonly tipoEmpresa = signal("");
  readonly nivel = signal<number | null>(null);
  readonly numCtaPapa = signal("");
  readonly nivelControl = new FormControl<number | null>(null);
  readonly cuentaPadreControl = new FormControl<string | null>(null);
  readonly tiposEmpresa = signal<MovimientoFilterOption<string>[]>([]);
  readonly niveles = signal<MovimientoFilterOption<number>[]>([]);
  readonly cuentasPadre = signal<MovimientoFilterOption<string>[]>([]);
  readonly loadingFilterOptions = signal(false);
  readonly page = signal(1);
  readonly budgetPage = signal(1);
  readonly loading = signal(false);
  readonly error = signal("");
  readonly movimientos = signal<PagedResponse<MovimientoResponse>>({ items: [], totalCount: 0, page: 1, pageSize: 50, totalPages: 0 });
  readonly saldos = signal<SaldoResponse[]>([]);
  readonly budgetRows = signal<PagedResponse<SaldoResponse>>({ items: [], totalCount: 0, page: 1, pageSize: 100, totalPages: 0 });
  readonly estadoCuenta = signal<EstadoDeCuentaResponse | null>(null);
  readonly estadoCuentaPresupuesto = signal<SaldoResponse | null>(null);
  readonly loadingEstadoCuenta = signal(false);
  readonly syncPanelOpen = signal(false);
  readonly syncLoading = signal(false);
  readonly syncCustomers = signal<MockAspelSyncCustomer[]>([]);
  readonly selectedSyncCustomerId = signal("");
  readonly syncError = signal("");
  readonly notice = signal("");

  readonly months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  ngOnInit(): void {
    this.loadFilterOptions();
    this.refresh();
  }

  refresh(resetPage = true): void {
    if (resetPage) {
      this.page.set(1);
      this.budgetPage.set(1);
    }
    this.loading.set(true);
    this.error.set("");
    const baseQuery = {
      ejercicio: this.year(),
      periodo: this.period(),
      tipoEmpresa: this.tipoEmpresa() || undefined,
      nivel: this.nivel() ?? undefined,
      numCtaPapa: this.numCtaPapa() || undefined,
    };
    const query = { ...baseQuery, page: this.page(), pageSize: 50 };

    this.mockAspelS.getMovimientos(query).subscribe({
      next: (response) => {
        this.movimientos.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(this.readError(error));
      },
    });

    this.mockAspelS.getSaldos({ ...baseQuery, page: 1, pageSize: 6 }).subscribe({
      next: (response) => this.saldos.set(response.items),
      error: () => this.saldos.set([]),
    });

    this.mockAspelS.getSaldos({ ...baseQuery, page: this.budgetPage(), pageSize: 100 }).subscribe({
      next: (response) => this.budgetRows.set(response),
      error: () => this.budgetRows.set({ items: [], totalCount: 0, page: 1, pageSize: 100, totalPages: 0 }),
    });
  }

  changePage(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.movimientos().totalPages || nextPage === this.page()) return;
    this.page.set(nextPage);
    this.refresh(false);
  }

  changeBudgetPage(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.budgetRows().totalPages || nextPage === this.budgetPage()) return;
    this.budgetPage.set(nextPage);
    this.refresh(false);
  }

  monthValue(saldo: SaldoResponse, prefix: "Cargo" | "Abono"): number {
    return Number(saldo[`${prefix}${String(this.period()).padStart(2, "0")}`] ?? 0);
  }

  budgetStatusClass(saldo: SaldoResponse): string {
    if (!saldo.presupuestoMes) return "neutral";
    if (saldo.porcentajeEjecucion <= 100) return "healthy";
    if (saldo.porcentajeEjecucion <= 115) return "warning";
    return "danger";
  }

  budgetStatusLabel(saldo: SaldoResponse): string {
    if (!saldo.presupuestoMes) return "Sin presupuesto";
    return `${saldo.porcentajeEjecucion.toLocaleString("es-MX", { maximumFractionDigits: 2 })}% ejecutado`;
  }

  trackMovimiento(_: number, movimiento: MovimientoResponse): string {
    return movimiento.id;
  }

  showBudgetView(): void { this.activeView.set("budget"); }

  showLedgerView(): void { this.activeView.set("ledger"); }

  openEstadoDeCuenta(movimiento: MovimientoResponse): void {
    if (movimiento.tipoCuenta !== "D") return;
    this.error.set("");
    this.estadoCuenta.set(null);
    this.estadoCuentaPresupuesto.set(null);
    this.loadingEstadoCuenta.set(true);
    this.mockAspelS.getEstadoDeCuenta(movimiento.numCta, { ejercicio: this.year(), tipoEmpresa: movimiento.tipoEmpresa }).subscribe({
      next: (estado) => { this.estadoCuenta.set(estado); this.loadingEstadoCuenta.set(false); },
      error: (error) => { this.error.set(this.readError(error)); this.loadingEstadoCuenta.set(false); },
    });
    this.mockAspelS.getSaldos({ ejercicio: this.year(), periodo: this.period(), tipoEmpresa: movimiento.tipoEmpresa, numCta: movimiento.numCta, page: 1, pageSize: 1 }).subscribe({
      next: (response) => this.estadoCuentaPresupuesto.set(response.items[0] ?? null),
      error: () => this.estadoCuentaPresupuesto.set(null),
    });
  }

  closeEstadoDeCuenta(): void {
    this.estadoCuenta.set(null);
    this.estadoCuentaPresupuesto.set(null);
  }

  onYearChanged(value: number): void {
    this.year.set(Number(value));
    this.resetCatalogFilters();
    this.loadFilterOptions();
  }

  onTipoEmpresaChanged(value: string): void {
    this.tipoEmpresa.set(value ?? "");
    this.resetCatalogFilters();
    this.loadFilterOptions();
  }

  onPeriodChanged(value: number): void {
    this.period.set(Number(value));
    this.resetCatalogFilters();
    this.loadFilterOptions();
  }

  onNivelChanged(value: number | null): void {
    this.nivel.set(value === null ? null : Number(value));
    this.numCtaPapa.set("");
    this.cuentaPadreControl.setValue(null, { emitEvent: false });
    this.loadFilterOptions();
  }

  onCuentaPadreChanged(value: string | null): void {
    this.numCtaPapa.set(value ?? "");
  }

  openSyncPanel(): void {
    this.syncPanelOpen.set(true);
    this.syncError.set("");
    this.mockAspelS.getSyncCustomers().subscribe({
      next: (customers) => {
        this.syncCustomers.set(customers);
        const currentSelectionIsValid = customers.some((customer) => customer.customerId === this.selectedSyncCustomerId());
        this.selectedSyncCustomerId.set(currentSelectionIsValid ? this.selectedSyncCustomerId() : (customers[0]?.customerId ?? ""));
      },
      error: (error) => this.syncError.set(this.readError(error)),
    });
  }

  closeSyncPanel(): void { if (!this.syncLoading()) this.syncPanelOpen.set(false); }

  syncRealData(): void {
    const customerId = this.selectedSyncCustomerId();
    if (!customerId) { this.syncError.set("Selecciona un cliente antes de sincronizar."); return; }
    this.syncLoading.set(true);
    this.syncError.set("");
    this.notice.set("");
    this.mockAspelS.syncRealData(customerId, this.year()).subscribe({
      next: (result) => {
        this.syncLoading.set(false);
        this.syncPanelOpen.set(false);
        if (result.ultimoPeriodoConMovimientos > 0) this.period.set(result.ultimoPeriodoConMovimientos);
        this.tipoEmpresa.set("");
        this.resetCatalogFilters();
        this.loadFilterOptions();
        const month = result.ultimoPeriodoConMovimientos > 0 ? ` hasta ${this.months[result.ultimoPeriodoConMovimientos - 1]}` : "";
        this.notice.set(`Se sincronizaron ${result.auxiliares.toLocaleString("es-MX")} movimientos de ${result.customerName}${month}.`);
        this.refresh();
      },
      error: (error) => { this.syncLoading.set(false); this.syncError.set(this.readError(error)); },
    });
  }

  private resetCatalogFilters(): void {
    this.nivel.set(null);
    this.numCtaPapa.set("");
    this.nivelControl.setValue(null, { emitEvent: false });
    this.cuentaPadreControl.setValue(null, { emitEvent: false });
    this.cuentasPadre.set([]);
  }

  private loadFilterOptions(): void {
    this.loadingFilterOptions.set(true);
    this.mockAspelS.getMovimientoFilterOptions({
      ejercicio: this.year(),
      periodo: this.period(),
      tipoEmpresa: this.tipoEmpresa() || undefined,
      nivel: this.nivel() ?? undefined,
    }).subscribe({
      next: (options) => {
        this.tiposEmpresa.set(options.tiposEmpresa);
        this.niveles.set(options.niveles);
        this.cuentasPadre.set(options.cuentasPadre);
        this.loadingFilterOptions.set(false);
      },
      error: (error) => {
        this.loadingFilterOptions.set(false);
        this.error.set(this.readError(error));
      },
    });
  }

  private readError(error: any): string {
    const payload = error?.error;
    if (typeof payload === "string") return payload;
    if (payload?.detail) return payload.detail;
    if (payload?.message) return payload.message;
    if (payload?.Message) return payload.Message;
    if (Array.isArray(payload?.errors)) return payload.errors.join(", ");
    if (Array.isArray(payload?.Errors)) return payload.Errors.join(", ");
    return "No se pudieron consultar los datos del simulador.";
  }
}
