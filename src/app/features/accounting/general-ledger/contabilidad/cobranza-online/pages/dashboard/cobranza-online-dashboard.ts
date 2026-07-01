import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonIcon } from "src/app/core/components/buttons/web/icon/button";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { PieChart } from "src/app/core/components/web/charts/pie-chart";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ChargeTemplateForm } from "src/app/features/accounting/general-ledger/contabilidad/cobranza-nativa/pages/charge-templates/charge-template-form";
import type {
  CobranzaOnlineDashboardResponse,
  CobranzaOnlineResumenItem,
  CobranzaOnlineStatementMovement,
  CobranzaOnlineStatementResponse,
} from "../../models/cobranza-online-dashboard.model";
import type {
  CobranzaOnlineSyncDiagnostics,
  CobranzaOnlineSyncMetadata,
  CobranzaOnlineSyncResponse,
} from "../../models/cobranza-online-sync.model";

@Component({
  selector: "app-cobranza-online-dashboard",
  imports: [
    CommonModule,
    RouterModule,
    MessageModule,
    ChartModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PieChart,
    AppIcon,
    WebButtonLabel,
    WebButtonIcon,
  ],
  templateUrl: "./cobranza-online-dashboard.html",
  styles: `
    :host {
      --co-surface: #ffffff;
      --co-ink: #0f172a;
      --co-muted: #7c8aa5;
      --co-line: #dbe4f0;
      --co-soft: #f6f9fc;
      --co-accent: #173b72;
      --co-good: #166534;
      --co-bad: #8f1d21;
      --co-warm: #b7791f;
    }

    .co-shell {
      background:
        radial-gradient(
          circle at top right,
          rgba(23, 59, 114, 0.06),
          transparent 24%
        ),
        linear-gradient(180deg, #fbfdff 0%, #f3f7fb 100%);
    }

    .co-panel {
      background: var(--co-surface);
      border: 1px solid var(--co-line);
      border-radius: 18px;
      box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
    }

    .co-kpi {
      min-height: 122px;
      position: relative;
      overflow: hidden;
    }

    .co-kpi::after {
      content: "";
      position: absolute;
      inset: auto -18px -18px auto;
      width: 70px;
      height: 70px;
      border-radius: 999px;
      background: rgba(23, 59, 114, 0.06);
    }

    .co-kpi-label {
      color: var(--co-muted);
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }

    .co-kpi-value {
      color: var(--co-ink);
      font-size: clamp(1.35rem, 2vw, 1.9rem);
      font-weight: 800;
      line-height: 1.05;
    }

    .co-kpi-note {
      color: var(--co-muted);
      font-size: 0.82rem;
    }

    .co-chip-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0.75rem;
    }

    .co-chip-card {
      background: var(--co-soft);
      border: 1px solid var(--co-line);
      border-radius: 14px;
      padding: 0.9rem 1rem;
    }

    .co-template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.75rem;
    }

    .co-template-card {
      border: 1px solid var(--co-line);
      border-radius: 14px;
      padding: 0.9rem 1rem;
      background: linear-gradient(180deg, #ffffff 0%, #f9fbfe 100%);
    }

    .co-chart-wrap {
      display: grid;
      grid-template-columns: minmax(0, 240px) minmax(0, 1fr);
      gap: 1rem;
      align-items: center;
    }

    .co-chart-box {
      height: 240px;
      max-width: 280px;
      margin-inline: auto;
    }

    .co-legend-list {
      display: grid;
      gap: 0.75rem;
    }

    .co-legend-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 0.9rem;
      border-radius: 14px;
      border: 1px solid var(--co-line);
      background: var(--co-soft);
    }

    .co-legend-meta {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      min-width: 0;
    }

    .co-dot {
      width: 12px;
      height: 12px;
      border-radius: 999px;
      flex: 0 0 12px;
    }

    .co-legend-title {
      color: var(--co-ink);
      font-weight: 700;
      font-size: 0.92rem;
    }

    .co-legend-subtitle {
      color: var(--co-muted);
      font-size: 0.78rem;
    }

    .co-legend-value {
      color: var(--co-ink);
      font-weight: 800;
      font-size: 0.96rem;
      white-space: nowrap;
    }

    .co-top-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .co-top-card {
      border: 1px solid var(--co-line);
      border-radius: 14px;
      padding: 0.85rem 0.95rem;
      background: var(--co-soft);
      min-height: 98px;
    }

    .co-top-name {
      color: var(--co-ink);
      font-weight: 700;
      font-size: 0.9rem;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .co-top-balance {
      color: var(--co-bad);
      font-weight: 800;
      font-size: 1.25rem;
      line-height: 1.1;
    }

    .co-mini-stat {
      border: 1px dashed var(--co-line);
      border-radius: 12px;
      padding: 0.7rem 0.85rem;
      background: rgba(255, 255, 255, 0.75);
    }

    .co-mini-stat-label {
      color: var(--co-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
    }

    .co-mini-stat-value {
      color: var(--co-ink);
      font-size: 1rem;
      font-weight: 800;
    }

    .co-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .co-status-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .co-status-box {
      grid-column: span 6;
      padding: 0.8rem 0.95rem;
      border-radius: 14px;
      background: var(--co-soft);
      border: 1px solid var(--co-line);
    }

    .co-status-box--message {
      grid-column: span 12;
      border-color: rgba(22, 101, 52, 0.18);
      background: linear-gradient(180deg, #f4fdf7 0%, #e9f8ef 100%);
    }

    .co-status-label {
      color: var(--co-muted);
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }

    .co-status-value {
      color: var(--co-ink);
      font-weight: 700;
    }

    @media (min-width: 992px) {
      .co-status-box {
        grid-column: span 3;
      }
    }

    @media (min-width: 1400px) {
      .co-status-box {
        grid-column: span 2;
      }

      .co-status-box--message {
        grid-column: span 4;
      }
    }

    @media (max-width: 991px) {
      .co-chart-wrap,
      .co-top-grid,
      .co-status-grid {
        grid-template-columns: 1fr;
      }

      .co-status-box,
      .co-status-box--message {
        grid-column: span 1;
      }

      .co-chart-box {
        height: 220px;
      }
    }
  `,
})
export class CobranzaOnlineDashboard {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonth = signal(new Date().getMonth() + 1);
  readonly currentDay = signal(new Date().getDate());

  readonly currentDate = computed(() => {
    const y = this.currentYear();
    const m = this.currentMonth().toString().padStart(2, "0");
    const d = this.currentDay().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  readonly currentMonthName = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth() - 1, 1);
    return date.toLocaleDateString("es-MX", { month: "long" });
  });

  onDateChange(dateString: string) {
    if (!dateString) return;
    const parts = dateString.split("-");
    if (parts.length === 3) {
      this.currentYear.set(parseInt(parts[0], 10));
      this.currentMonth.set(parseInt(parts[1], 10));
      this.currentDay.set(parseInt(parts[2], 10));
    }
  }
  readonly loading = signal(false);
  readonly syncRunning = signal(false);
  readonly detailLoading = signal(false);
  readonly syncStatus = signal<CobranzaOnlineSyncMetadata | null>(null);
  readonly lastSyncDiagnostics = signal<CobranzaOnlineSyncDiagnostics | null>(
    null,
  );
  readonly dashboard = signal<CobranzaOnlineDashboardResponse | null>(null);
  readonly selectedSummaryAccountId = signal<string | null>(null);
  readonly selectedAccountId = signal<string | null>(null);
  readonly selectedMovement = signal<CobranzaOnlineStatementMovement | null>(
    null,
  );
  readonly selectedStatement = signal<CobranzaOnlineStatementResponse | null>(
    null,
  );
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly currentCutLabel = computed(
    () =>
      `${this.currentMonth().toString().padStart(2, "0")}/${this.currentYear()}`,
  );

  readonly messageSeverity = computed(() => {
    if (this.syncStatus()?.dataSource === "aspel-live") {
      return "success";
    }

    if (this.syncStatus()?.isFallback) {
      return "warn";
    }

    switch (this.syncStatus()?.syncStatus) {
      case "fresca":
        return "success";
      case "aceptable":
      case "sin-metadata":
        return "info";
      case "desactualizada":
        return "warn";
      default:
        return "error";
    }
  });

  readonly formattedLastSync = computed(() => {
    const lastSyncAt = this.syncStatus()?.lastSyncAt;
    if (!lastSyncAt) {
      return "Sin datos";
    }

    const parsedDate = new Date(lastSyncAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return lastSyncAt;
    }

    return `${this.formatDateShort(parsedDate)} ${parsedDate.toLocaleTimeString("es-MX", { timeStyle: "short" })}`;
  });

  readonly chartData = computed(() => {
    const categories = this.dashboard()?.categories ?? [];
    const hasVisibleTotals = categories.some(
      (category) => Math.abs(category.total) > 0,
    );
    const categoryColorMap: Record<string, string> = {
      morosos: "#b91c1c",
      "deuda-corriente": "#1d4ed8",
      collected: "#15803d",
    };
    const fallbackPalette = [
      "#1d4ed8",
      "#6d28d9",
      "#0f766e",
      "#be185d",
      "#9a3412",
      "#a16207",
    ];

    if (!hasVisibleTotals) {
      return {
        labels: ["Sin movimientos del mes"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["#cbd5e1"],
            hoverBackgroundColor: ["#cbd5e1"],
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels: categories.map((category) => category.title),
      datasets: [
        {
          data: categories.map((category) => Math.abs(category.total)),
          backgroundColor: categories.map(
            (category, index) =>
              categoryColorMap[category.categoryId] ??
              fallbackPalette[index % fallbackPalette.length],
          ),
          hoverBackgroundColor: categories.map(
            (category, index) =>
              categoryColorMap[category.categoryId] ??
              fallbackPalette[index % fallbackPalette.length],
          ),
          borderWidth: 0,
        },
      ],
    };
  });

  readonly pieChartData = computed<any[]>(() => {
    const categories =
      this.dashboard()?.categories.filter(
        (c) => c.categoryId !== "deuda-anterior",
      ) ?? [];
    const hasVisibleTotals = categories.some(
      (category) => Math.abs(category.total) > 0,
    );

    if (!hasVisibleTotals) {
      return [
        {
          name: "Sin movimientos del mes",
          value: 1,
        },
      ];
    }

    return categories.map((category) => ({
      name: category.title,
      value: Math.abs(category.total),
    }));
  });

  readonly tableCobranzaPerfecta = computed(() => {
    const kpis = this.dashboard()?.kpis;
    const categories = this.dashboard()?.categories ?? [];
    const total = kpis?.totalDueCurrentMonth ?? 0;

    const cobrado =
      categories.find((c) => c.categoryId === "collected")?.total ?? 0;
    const morosos =
      categories.find((c) => c.categoryId === "morosos")?.total ?? 0;
    const deudaCorriente =
      categories.find((c) => c.categoryId === "deuda-corriente")?.total ?? 0;

    return [
      {
        id: "",
        clasificacion: "COBRANZA PERFECTA",
        saldo: total,
        porcentaje: total ? 1 : 0,
        isTotal: true,
      },
      {
        id: "2",
        clasificacion: "MOROSOS",
        saldo: morosos,
        porcentaje: total ? morosos / total : 0,
        isTotal: false,
      },
      {
        id: "3",
        clasificacion: "DEUDA CORRIENTE",
        saldo: deudaCorriente,
        porcentaje: total ? deudaCorriente / total : 0,
        isTotal: false,
      },
      {
        id: "",
        clasificacion: "COBRADO",
        saldo: cobrado,
        porcentaje: total ? cobrado / total : 0,
        isTotal: false,
      },
    ];
  });

  readonly tableDeudaCondominos = computed(() => {
    const categories = this.dashboard()?.categories ?? [];

    const judicial =
      categories.find((c) => c.categoryId === "deuda-anterior")?.total ?? 0;
    const morosos =
      categories.find((c) => c.categoryId === "morosos")?.total ?? 0;
    const deudaCorriente =
      categories.find((c) => c.categoryId === "deuda-corriente")?.total ?? 0;

    const total = judicial + morosos + deudaCorriente;

    return [
      {
        id: "1",
        clasificacion: "COBRANZA JUDICIAL",
        saldo: judicial,
        porcentaje: total ? judicial / total : 0,
        isTotal: false,
      },
      {
        id: "2",
        clasificacion: "MOROSOS",
        saldo: morosos,
        porcentaje: total ? morosos / total : 0,
        isTotal: false,
      },
      {
        id: "3",
        clasificacion: "DEUDA CORRIENTE",
        saldo: deudaCorriente,
        porcentaje: total ? deudaCorriente / total : 0,
        isTotal: false,
      },
      {
        id: "",
        clasificacion: "TOTAL",
        saldo: total,
        porcentaje: total ? 1 : 0,
        isTotal: true,
      },
    ];
  });

  readonly pieColorScheme = computed<any>(() => {
    const categories = this.dashboard()?.categories ?? [];
    const hasVisibleTotals = categories.some(
      (category) => Math.abs(category.total) > 0,
    );

    const categoryColorMap: Record<string, string> = {
      morosos: "#b91c1c",
      "deuda-corriente": "#1d4ed8",
      collected: "#15803d",
    };
    const fallbackPalette = [
      "#1d4ed8",
      "#6d28d9",
      "#0f766e",
      "#be185d",
      "#9a3412",
      "#a16207",
    ];

    if (!hasVisibleTotals) {
      return { domain: ["#cbd5e1"] };
    }

    const domain = categories.map(
      (category, index) =>
        categoryColorMap[category.categoryId] ??
        fallbackPalette[index % fallbackPalette.length],
    );

    return { domain };
  });

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    layout: {
      padding: 4,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; raw?: number | string }) => {
            const value = Number(context.raw || 0);
            return `${context.label || "Valor"}: ${this.formatCurrency(value)}`;
          },
        },
      },
    },
  };

  readonly chartLegend = computed(() => {
    const categories = this.dashboard()?.categories ?? [];
    const colors = (this.chartData().datasets?.[0]?.backgroundColor ??
      []) as string[];
    return categories.map((category, index) => ({
      title: category.title,
      subtitle: `${category.count} cuentas consideradas`,
      total: category.total,
      color: colors[index] ?? "#94a3b8",
    }));
  });

  readonly topDebtorsPreview = computed(() =>
    (this.dashboard()?.topDebtors ?? []).slice(0, 6),
  );

  readonly allDebtors = computed(() => this.dashboard()?.departments ?? []);

  readonly totalDebtorsMaintenance = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.maintenanceBalance || 0), 0),
  );

  readonly totalDebtorsExtraordinary = computed(() =>
    this.allDebtors().reduce(
      (sum, d) => sum + (d.extraordinaryBalance || 0),
      0,
    ),
  );

  readonly totalDebtorsBalance = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.balance || 0), 0),
  );

  readonly selectedSummary = computed(
    () =>
      this.dashboard()?.summaries.find(
        (summary) => summary.accountId === this.selectedSummaryAccountId(),
      ) ?? null,
  );

  readonly departmentRows = computed(() =>
    (this.dashboard()?.departments ?? []).filter(
      (row) => row.summaryAccountId === this.selectedSummaryAccountId(),
    ),
  );

  readonly topDebtorsMobile = computed(() =>
    this.departmentRows().map((row) => ({
      ...row,
      categoryLabel: row.summaryAccountName,
      displayName: row.propertyFullName || row.accountName,
      balanceLabel: this.formatCurrency(row.balance),
      isSelected: this.selectedAccountId() === row.accountId,
    })),
  );

  readonly movementPreview = computed(() => {
    const movement = this.selectedMovement();
    if (!movement) {
      return null;
    }

    return {
      title: movement.concept || movement.policyConcept || "Movimiento",
      subtitle: `${movement.policyType} ${movement.policyNumber} é ${this.formatDate(movement.policyDate)}`,
      amountLabel: this.formatCurrency(movement.amount),
    };
  });

  readonly saneamientoActual: CobranzaOnlineResumenItem[] = [
    {
      titulo: "Resumen 401 en vivo",
      descripcion:
        "El dashboard consulta el bloque 401 en vivo sobre Aspel para renderizar el corte operativo actual.",
    },
    {
      titulo: "Drilldown por departamento",
      descripcion:
        "Cada cuenta global 401 puede abrir su desglose operativo por departamento y desde ahi continuar al estado de cuenta de la unidad.",
    },
    {
      titulo: "Sin tocar presupuesto",
      descripcion:
        "La entrega queda encapsulada dentro de Cobranza Online y no modifica consultas ni contratos de presupuesto.",
    },
  ];

  readonly bloquesPlaneados: CobranzaOnlineResumenItem[] = [
    {
      titulo: "Refuerzo de sincronizacion",
      descripcion:
        "Las nuevas sincronizaciones deben seguir persistiendo la contrapartida de auxiliares para mejorar el amarre 104 contra 401.",
    },
    {
      titulo: "Rehidratacion historica",
      descripcion:
        "Si se necesita exactitud historica completa, el siguiente paso es refrescar los ejercicios anteriores con el campo de contrapartida ya guardado.",
    },
    {
      titulo: "Capas siguientes",
      descripcion:
        "Despues de estabilizar el resumen global se puede afinar el corte por concepto y enriquecer el detalle de movimientos relacionados.",
    },
  ];

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.lastSyncDiagnostics.set(null);
        this.syncStatus.set(null);
        this.dashboard.set(null);
        this.selectedSummaryAccountId.set(null);
        this.selectedAccountId.set(null);
        this.selectedMovement.set(null);
        this.selectedStatement.set(null);
        return;
      }

      void this.loadSummary(customerId);
    });
  }

  private async loadSummary(customerId: string) {
    this.loading.set(true);

    const dashboard =
      await this.apiResponseS.onGetItem<CobranzaOnlineDashboardResponse>(
        Endpoints.AccountingCoi.CobranzaOnline.Dashboard.get(
          customerId,
          this.currentYear(),
          this.currentMonth(),
          this.currentDay(),
        ),
        false,
      );

    const typedDashboard = dashboard as CobranzaOnlineDashboardResponse | null;
    this.syncStatus.set(typedDashboard?.syncMetadata ?? null);
    this.dashboard.set(typedDashboard);

    const firstSummary = typedDashboard?.summaries?.[0] ?? null;
    this.selectedSummaryAccountId.set(firstSummary?.accountId ?? null);

    const firstDepartment =
      typedDashboard?.departments?.find(
        (row) => row.summaryAccountId === firstSummary?.accountId,
      ) ?? null;

    if (firstDepartment) {
      await this.loadStatement(customerId, firstDepartment.accountId);
    } else {
      this.selectedAccountId.set(null);
      this.selectedMovement.set(null);
      this.selectedStatement.set(null);
    }

    this.loading.set(false);
  }

  async onSelectSummary(summaryAccountId: string) {
    if (this.selectedSummaryAccountId() === summaryAccountId) {
      return;
    }

    this.selectedSummaryAccountId.set(summaryAccountId);
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return;
    }

    const nextDepartment = this.dashboard()?.departments.find(
      (row) => row.summaryAccountId === summaryAccountId,
    );

    if (nextDepartment) {
      await this.loadStatement(customerId, nextDepartment.accountId);
      return;
    }

    this.selectedAccountId.set(null);
    this.selectedMovement.set(null);
    this.selectedStatement.set(null);
  }

  async onSelectDebtor(accountId: string) {
    const customerId = this.customerIdS.customerId();
    if (!customerId || this.selectedAccountId() === accountId) {
      return;
    }

    await this.loadStatement(customerId, accountId);
  }

  async onSyncNow() {
    const customerId = this.customerIdS.customerId();
    if (!customerId || this.syncRunning()) {
      return;
    }

    this.syncRunning.set(true);
    try {
      const response =
        await this.apiResponseS.onPost<CobranzaOnlineSyncResponse>(
          Endpoints.AccountingCoi.CobranzaOnline.Sync.cobranza(
            customerId,
            this.currentYear(),
          ),
          {},
        );

      if (response !== false) {
        this.lastSyncDiagnostics.set(response?.diagnostics ?? null);
        await this.loadSummary(customerId);
      }
    } finally {
      this.syncRunning.set(false);
    }
  }

  onModalForm(id: string = "") {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return;
    }

    const data = {
      id,
      title: id === "" ? "Nueva Plantilla de Cargo" : "Editar Plantilla",
      customerId,
    };

    this.dialogHandlerS
      .openDialog(
        ChargeTemplateForm,
        data,
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((res: boolean) => {
        if (res) {
          void this.loadSummary(customerId);
        }
      });
  }

  getCategoryLabel(categoryId: string) {
    const summary = this.dashboard()?.summaries.find(
      (item) => item.accountNumber === categoryId,
    );
    return summary?.accountName || categoryId;
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  }

  formatDate(value: string) {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return this.formatDateShort(parsedDate);
  }

  formatDateShort(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("es-MX", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  onSelectMovement(movement: CobranzaOnlineStatementMovement) {
    this.selectedMovement.set(movement);
  }

  private async loadStatement(customerId: string, accountId: string) {
    this.detailLoading.set(true);
    this.selectedAccountId.set(accountId);
    this.selectedMovement.set(null);

    const statement =
      await this.apiResponseS.onGetItem<CobranzaOnlineStatementResponse>(
        Endpoints.AccountingCoi.CobranzaOnline.Statements.get(
          customerId,
          accountId,
          this.currentYear(),
        ),
      );

    const typedStatement = statement as CobranzaOnlineStatementResponse | null;
    this.selectedStatement.set(typedStatement);
    this.selectedMovement.set(typedStatement?.movimientos?.[0] ?? null);
    this.detailLoading.set(false);
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}
