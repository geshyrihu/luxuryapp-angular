import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import {
  AppBreakdownList,
  type BreakdownItem,
} from "@ui/shared/breakdown-list/breakdown-list";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  DialogHandlerService,
  DialogSize,
} from "src/app/core/services/dialog-handler.service";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";
import { CobranzaOnlineComposicionReportesModal } from "./cobranza-online-composicion-reportes-modal";

@Component({
  selector: "app-cobranza-online-analysis",
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    ChartWrapper,
    AppStatCard,
    AppBreakdownList,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cobranza-online-analysis.html",
})
export class CobranzaOnlineAnalysis {
  readonly showTopKpis = input(true);
  readonly showFlujoReal = input(true);
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private store = inject(CobranzaOnlineStoreService);
  private dialogS = inject(DialogHandlerService);

  async onOpenComposicionReportes() {
    try {
      await this.dialogS.openDialog(
        CobranzaOnlineComposicionReportesModal,
        {},
        "Cómo se compone cada reporte",
        DialogSize.lg,
      );
    } catch (error) {
      console.error("Error opening composition dialog", error);
    }
  }

  readonly loading = this.store.isLoading;
  readonly selectedClassification = signal("TODAS");
  readonly data = this.store.analysisData;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());

  readonly classificationOptions = [
    "TODAS",
    "COBRANZA EXTRAJUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
    "ANTICIPOS",
  ];

  readonly globalFilterFields = computed(() => [
    "numeroCuenta",
    "condomino",
    "clasificacion",
  ]);

  readonly messageSeverity = computed(() =>
    this.data()?.syncMetadata?.dataSource === "aspel-live" ? "success" : "warn",
  );

  /** Cuota promedio del mes, como referencia bajo el KPI de mantenimiento. */
  readonly cuotaPromedioSubtitulo = computed(() => {
    const d = this.data();
    if (!d?.totalCondominios) return "";

    const promedio = d.cuotaMttoVigente / d.totalCondominios;
    const formateado = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(promedio);

    return `Promedio ${formateado} por condómino`;
  });

  /** Bloque histórico del Excel: el "Cobrado" es residual, no flujo de caja. */
  readonly filasAnalisisMensual = computed<BreakdownItem[]>(() => {
    const d = this.data();
    if (!d) return [];

    return [
      {
        label: "Morosos",
        value: d.totalMorosos,
        color: "var(--ds-danger)",
        description: "2+ cuotas vencidas de mtto o 1+ de extraordinaria",
      },
      {
        label: "Deuda corriente",
        value: d.totalDeudaCorriente,
        color: "var(--ds-info)",
        description: "Debe sin alcanzar los umbrales de moroso",
      },
      {
        label: "Cobrado",
        value: d.totalCobrado,
        color: "var(--ds-success)",
        description: "Residual: perfecta - morosos - corriente",
      },
      { label: "Cobranza perfecta", value: d.cobranzaPerfecta, isTotal: true },
    ];
  });

  /** Flujo real del periodo: lo abonado contra la cuota del mes. */
  readonly filasCobranzaMes = computed<BreakdownItem[]>(() => {
    const d = this.data();
    if (!d) return [];

    const filas: BreakdownItem[] = [
      {
        label: "Cobrado",
        value: d.cobradoMes,
        color: "var(--ds-success)",
        description: (() => {
          const parts = [`Mtto ${this.moneda(d.cobradoMttoMes)}`];
          if (d.cobradoExtraordinariaMes) parts.push(`extraordinaria ${this.moneda(d.cobradoExtraordinariaMes)}`);
          if (d.cobradoRestaurantMes) parts.push(`restaurante ${this.moneda(d.cobradoRestaurantMes)}`);
          return parts.length > 1 ? parts.join(' - ') : "Abonos aplicados en el mes";
        })(),
      },
      {
        label: "Faltante por cobrar",
        value: d.faltanteMes,
        color: "var(--ds-warning)",
        description: "Cobranza perfecta - cobrado",
      },
      { label: "Cobranza perfecta", value: d.cobranzaPerfecta, isTotal: true },
    ];

    return filas;
  });

  /** Cartera acumulada al corte; aquí sí entra la cobranza judicial. */
  readonly filasDeudaCondominos = computed<BreakdownItem[]>(() => {
    const d = this.data();
    if (!d) return [];

    return [
      {
        label: "Cobranza judicial",
        value: d.totalJudicial,
        color: "var(--ds-danger)",
        description: "Más de 5 cuotas vencidas de mtto o 5+ de extraordinaria o restaurante",
      },
      {
        label: "Morosos",
        value: d.totalMorosos,
        color: "var(--ds-warning)",
        description: "2+ cuotas vencidas de mtto o 1+ de ext. o restaurante",
      },
      {
        label: "Deuda corriente",
        value: d.totalDeudaCorriente,
        color: "var(--ds-info)",
        description: "Debe sin alcanzar los umbrales de moroso",
      },
      { label: "Total deuda", value: d.totalDeuda, isTotal: true },
    ];
  });

  private moneda(value: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  }

  private token(key: string, fallback: string): string {
    if (typeof document === "undefined") {
      return fallback;
    }
    return (
      getComputedStyle(document.documentElement).getPropertyValue(key).trim() ||
      fallback
    );
  }

  readonly chartData = computed(() => {
    const analysis = this.data();
    if (!analysis) {
      return null;
    }

    const danger = this.token("--ds-danger", "#c0392b");
    const info = this.token("--ds-info", "#2980b9");
    const success = this.token("--ds-success", "#27ae60");
    const warning = this.token("--ds-warning", "#f39c12");

    // Si hay cobranza perfecta (meta mensual 001+003), mostramos la distribución
    // del mes: Morosos, Deuda Corriente y lo Cobrado.
    const morosos = analysis.totalMorosos ?? 0;
    const corriente = analysis.totalDeudaCorriente ?? 0;
    const cobrado = analysis.totalCobrado ?? 0;
    const judicial = analysis.totalJudicial ?? 0;

    const hayDeudaActiva =
      morosos > 0 || corriente > 0 || cobrado > 0 || judicial > 0;
    if (!hayDeudaActiva) {
      return null;
    }

    if ((analysis.cobranzaPerfecta ?? 0) > 0) {
      // Mostrar siempre Morosos, Deuda Corriente y Cobrado.
      // Si Cobrado es 0, el gráfico muestra sólo los segmentos con valor.
      const datos = [
        { label: "MOROSOS", value: morosos, color: danger },
        { label: "DEUDA CORRIENTE", value: corriente, color: info },
        { label: "COBRADO", value: cobrado, color: success },
      ].filter((d) => d.value > 0);

      return {
        labels: datos.map((d) => d.label),
        datasets: [
          {
            data: datos.map((d) => d.value),
            backgroundColor: datos.map((d) => d.color),
            hoverBackgroundColor: datos.map((d) => d.color),
            borderWidth: 2,
            borderColor: "transparent",
          },
        ],
      };
    }

    // Fallback: sin cobranza perfecta, mostramos la deuda activa
    const datos = [
      { label: "COBRANZA JUDICIAL", value: judicial, color: danger },
      { label: "MOROSOS", value: morosos, color: warning },
      { label: "DEUDA CORRIENTE", value: corriente, color: info },
    ].filter((d) => d.value > 0);

    return {
      labels: datos.map((d) => d.label),
      datasets: [
        {
          data: datos.map((d) => d.value),
          backgroundColor: datos.map((d) => d.color),
          hoverBackgroundColor: datos.map((d) => d.color),
          borderWidth: 2,
          borderColor: "transparent",
        },
      ],
    };
  });

  readonly filteredRows = computed(() => {
    const analysis = this.data();
    if (!analysis) {
      return [];
    }

    switch (this.selectedClassification()) {
      case "COBRANZA EXTRAJUDICIAL":
        return analysis.cobranzaJudicial;
      case "MOROSOS":
        return analysis.morosos;
      case "DEUDA CORRIENTE":
        return analysis.deudaCorriente;
      case "SIN ADEUDO":
        return analysis.sinAdeudo;
      case "ANTICIPOS":
        return analysis.anticipos;
      default:
        return [
          ...analysis.cobranzaJudicial,
          ...analysis.morosos,
          ...analysis.deudaCorriente,
          ...analysis.sinAdeudo,
          ...analysis.anticipos,
        ];
    }
  });

  constructor() {}

  getSeverity(clasificacion: string) {
    switch (clasificacion) {
      case "COBRANZA EXTRAJUDICIAL":
        return "danger";
      case "MOROSOS":
        return "warn";
      case "DEUDA CORRIENTE":
        return "info";
      case "SIN ADEUDO":
        return "success";
      case "ANTICIPOS":
        return "secondary";
      default:
        return "secondary";
    }
  }
}
