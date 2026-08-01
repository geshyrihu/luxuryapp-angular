import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LxIconField } from "@ui/adaptive/iconfield/iconfield";
import { LxInputIcon } from "@ui/adaptive/inputicon/inputicon";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PieChart } from "@ui/web/charts/pie-chart";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { MessageModule } from "@ui/web/primeng-message/primeng-message";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ChargeTemplateForm } from "../../cobranza-nativa/core/charge-templates/charge-template-form";
import { CobranzaOnlineService } from "../cobranza-online.service";
import type {
  CobranzaOnlineDashboardResponse,
  CobranzaOnlineResumenItem,
  CobranzaOnlineStatementMovement,
  CobranzaOnlineStatementResponse,
} from "../interfaces/cobranza-online-dashboard.model";
import type {
  CobranzaOnlineSyncDiagnostics,
  CobranzaOnlineSyncMetadata,
} from "../interfaces/cobranza-online-sync.model";

@Component({
  selector: "app-cobranza-online-dashboard",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MessageModule,
    ButtonModule,
    TableModule,
    LxIconField,
    LxInputIcon,
    CustomInputTextSignal,
    PieChart,
    AppIcon,
    WebButtonLabel,
    WebButtonIcon,
  ],
  templateUrl: "./cobranza-online-dashboard.html",
  styleUrls: ["./cobranza-online-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CobranzaOnlineDashboard {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private cobranzaOnlineS = inject(CobranzaOnlineService);
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
      morosos: "var(--ds-danger)",
      "deuda-corriente": "var(--ds-info)",
      collected: "var(--ds-success)",
    };
    const fallbackPalette = [
      "var(--ds-info)",
      "var(--ds-help)",
      "var(--ds-tertiary)",
      "var(--ds-secondary)",
      "var(--ds-warning)",
      "var(--ds-luxury-gold)",
    ];

    if (!hasVisibleTotals) {
      return {
        labels: ["Sin movimientos del mes"],
        datasets: [
          {
            data: [1],
            backgroundColor: ["var(--ds-surface-variant)"],
            hoverBackgroundColor: ["var(--ds-surface-variant)"],
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
      morosos: "var(--ds-danger)",
      "deuda-corriente": "var(--ds-info)",
      collected: "var(--ds-success)",
    };
    const fallbackPalette = [
      "var(--ds-info)",
      "var(--ds-help)",
      "var(--ds-tertiary)",
      "var(--ds-secondary)",
      "var(--ds-warning)",
      "var(--ds-luxury-gold)",
    ];

    if (!hasVisibleTotals) {
      return { domain: ["var(--ds-surface-variant)"] };
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
      color: colors[index] ?? "var(--ds-text-muted)",
    }));
  });

  readonly topDebtorsPreview = computed(() =>
    (this.dashboard()?.topDebtors ?? []).slice(0, 6),
  );

  readonly allDebtors = computed(() => this.dashboard()?.departments ?? []);

  readonly towers = computed(() => this.dashboard()?.towers ?? []);

  readonly advances = computed(() => this.dashboard()?.advances ?? []);

  readonly conceptChartData = computed(() => {
    const charges = this.dashboard()?.currentCharges;
    if (!charges) return null;

    const totalVigente =
      charges.maintenanceFee + charges.extraordinaryFee + charges.finesFee;
    if (totalVigente <= 0) {
      return {
        data: [{ name: "Sin Cuotas Vigentes", value: 1 }],
        colors: ["var(--ds-surface-variant)"],
      };
    }

    return {
      data: [
        { name: "Mantenimiento", value: charges.maintenanceFee },
        { name: "Extraordinaria", value: charges.extraordinaryFee },
        { name: "Multas", value: charges.finesFee },
      ],
      colors: [
        "var(--ds-info)",
        "var(--ds-warning)",
        "var(--ds-danger)",
      ],
    };
  });

  readonly collectedChartData = computed(() => {
    const charges = this.dashboard()?.currentCharges;
    const collectedConcepts = charges?.collectedConcepts ?? [];
    
    if (!collectedConcepts.length) {
      return {
        data: [{ name: "Sin Recaudación", value: 1 }],
        colors: ["var(--ds-surface-variant)"],
      };
    }

    const fallbackColors = [
      "var(--ds-success)",
      "var(--ds-info)",
      "var(--ds-help)",
      "var(--ds-primary)",
      "var(--ds-secondary)",
      "var(--ds-tertiary)"
    ];

    return {
      data: collectedConcepts.map(c => ({ name: c.conceptName, value: c.amount })),
      colors: collectedConcepts.map((_, i) => fallbackColors[i % fallbackColors.length]),
    };
  });

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

  readonly totalDebtorsFines = computed(() =>
    this.allDebtors().reduce((sum, d) => sum + (d.finesBalance || 0), 0),
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

    const dashboard = await this.cobranzaOnlineS.getDashboard(
      customerId,
      this.currentYear(),
      this.currentMonth(),
      this.currentDay(),
    );

    const typedDashboard = dashboard;
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
      const response = await this.cobranzaOnlineS.syncCobranza(
        customerId,
        this.currentYear(),
      );

      if (response !== null) {
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

    const statement = await this.cobranzaOnlineS.getStatement(
      customerId,
      accountId,
      this.currentYear(),
    );

    const typedStatement = statement;
    this.selectedStatement.set(typedStatement);
    this.selectedMovement.set(typedStatement?.movimientos?.[0] ?? null);
    this.detailLoading.set(false);
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}
