import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { PieChart } from "@ui/web/charts/pie-chart";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SharedModule } from "src/app/shared/ui/web/primeng-api/primeng-api";
import { ChargeTemplateForm } from "../../cobranza-nativa/core/charge-templates/charge-template-form";
import { clasificarCuenta } from "../helpers/cobranza-clasificacion";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";
import {
  CobranzaOnlineClasificacionDetail,
  type ClasificacionDetailData,
} from "./cobranza-online-clasificacion-detail";

@Component({
  selector: "app-cobranza-online-resumen",
  imports: [CommonModule, TableModule, SharedModule, PieChart],
  templateUrl: "./cobranza-online-resumen.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineResumen {
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private store = inject(CobranzaOnlineStoreService);

  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly loading = this.store.isLoading;
  readonly dashboard = this.store.dashboardData;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly allDebtors = computed(() => {
    const deps = this.dashboard()?.departments ?? [];

    return deps
      .map((d) => {
        const { clasificacion, isJudicial } = clasificarCuenta(d);
        return { ...d, clasificacion, isJudicial };
      })
      .sort((a, b) => b.balance - a.balance);
  });

  readonly tableCobranzaPerfecta = computed(() => {
    const all = this.allDebtors();
    const kpis = this.dashboard()?.kpis;
    const total = kpis?.totalDueCurrentMonth ?? 0;

    // Grupos basados en la misma clasificacion frontend que usa el modal
    const morosos = all.filter((d) => d.clasificacion === "MOROSOS");
    const corriente = all.filter((d) => d.clasificacion === "DEUDA CORRIENTE");

    const sumBalance = (arr: typeof all) =>
      arr.reduce((s, d) => s + (d.balance || 0), 0);

    const saldoMorosos = sumBalance(morosos);
    const saldoCorriente = sumBalance(corriente);

    // Cálculo matemático: Meta - Lo que nos deben los activos = Lo efectivamente cobrado
    const saldoCobradoCalculado = Math.max(
      0,
      total - saldoMorosos - saldoCorriente,
    );

    return [
      {
        clasificacion: "COBRANZA PERFECTA",
        description: "Total a recaudar este mes (-001 + -003)",
        filterKey: "COBRANZA_PERFECTA_ALL",
        saldo: total,
        porcentaje: total ? 1 : 0,
        isTotal: true,
      },
      {
        clasificacion: "MOROSOS",
        description: "2+ cuotas vencidas de mtto o 1+ de extraordinaria",
        filterKey: "MOROSOS",
        saldo: saldoMorosos,
        porcentaje: total ? saldoMorosos / total : 0,
        isTotal: false,
      },
      {
        clasificacion: "DEUDA CORRIENTE",
        description: "Saldo > 0 sin alcanzar las cuotas vencidas de moroso",
        filterKey: "DEUDA CORRIENTE",
        saldo: saldoCorriente,
        porcentaje: total ? saldoCorriente / total : 0,
        isTotal: false,
      },
      {
        clasificacion: "COBRADO / SIN ADEUDO",
        description: "Cobranza Perfecta - Morosos - Corriente",
        filterKey: "COBRADO",
        saldo: saldoCobradoCalculado,
        porcentaje: total ? saldoCobradoCalculado / total : 0,
        isTotal: false,
      },
    ];
  });

  readonly tableDeudaCondominos = computed(() => {
    const all = this.allDebtors();

    const judiciales = all.filter(
      (d) => d.clasificacion === "COBRANZA JUDICIAL",
    );
    const morosos = all.filter((d) => d.clasificacion === "MOROSOS");
    const corriente = all.filter((d) => d.clasificacion === "DEUDA CORRIENTE");

    const sumBalance = (arr: typeof all) =>
      arr.reduce((s, d) => s + (d.balance || 0), 0);

    const saldoJudicial = sumBalance(judiciales);
    const saldoMorosos = sumBalance(morosos);
    const saldoCorriente = sumBalance(corriente);
    const total = saldoJudicial + saldoMorosos + saldoCorriente;

    return [
      {
        clasificacion: "COBRANZA JUDICIAL",
        description: "Más de 5 cuotas vencidas de mtto o 5+ de extraordinaria",
        filterKey: "COBRANZA JUDICIAL",
        saldo: saldoJudicial,
        porcentaje: total ? saldoJudicial / total : 0,
        isTotal: false,
      },
      {
        clasificacion: "MOROSOS",
        description: "2+ cuotas vencidas de mtto o 1+ de extraordinaria",
        filterKey: "MOROSOS",
        saldo: saldoMorosos,
        porcentaje: total ? saldoMorosos / total : 0,
        isTotal: false,
      },
      {
        clasificacion: "DEUDA CORRIENTE",
        description: "Saldo > 0 sin alcanzar las cuotas vencidas de moroso",
        filterKey: "DEUDA CORRIENTE",
        saldo: saldoCorriente,
        porcentaje: total ? saldoCorriente / total : 0,
        isTotal: false,
      },
      {
        clasificacion: "TOTAL DEUDA",
        description: "",
        filterKey: "TOTAL_DEUDA_ALL",
        saldo: total,
        porcentaje: total ? 1 : 0,
        isTotal: true,
      },
    ];
  });

  private token(key: string, fallback: string): string {
    if (typeof document === "undefined") {
      return fallback;
    }
    return (
      getComputedStyle(document.documentElement).getPropertyValue(key).trim() ||
      fallback
    );
  }

  readonly collectionPieChart = computed(() => {
    const items = this.tableCobranzaPerfecta().filter((r) => !r.isTotal);

    const colors: Record<string, string> = {
      MOROSOS: this.token("--ds-danger", "red"),
      "DEUDA CORRIENTE": this.token("--ds-info", "blue"),
      "COBRADO / SIN ADEUDO": this.token("--ds-success", "green"),
    };

    const data = items.map((item) => ({
      name: item.clasificacion,
      value: item.saldo,
    }));

    const chartColors = items.map(
      (item) =>
        colors[item.clasificacion as keyof typeof colors] ||
        this.token("--ds-document-neutral", "gray"),
    );

    return {
      data,
      colors: chartColors,
    };
  });

  readonly maintenanceMetrics = computed(() => {
    return this.dashboard()?.currentCharges?.maintenance;
  });

  readonly extraordinaryMetrics = computed(() => {
    return this.dashboard()?.currentCharges?.extraordinary;
  });

  readonly maintenanceChartData = computed(() => {
    const m = this.maintenanceMetrics();
    if (!m || m.total <= 0) {
      return {
        data: [{ name: "Sin Mantenimiento", value: 1 }],
        colors: [this.token("--ds-document-neutral", "gray")],
      };
    }

    return {
      data: [
        { name: "Cobrado", value: m.collected },
        { name: "Pendiente", value: m.pending > 0 ? m.pending : 0 },
      ],
      colors: [
        this.token("--ds-success", "green"),
        this.token("--ds-warning", "orange"),
      ],
    };
  });

  readonly extraordinaryChartData = computed(() => {
    const m = this.extraordinaryMetrics();
    if (!m || m.total <= 0) {
      return null;
    }

    return {
      data: [
        { name: "Cobrado", value: m.collected },
        { name: "Pendiente", value: m.pending > 0 ? m.pending : 0 },
      ],
      colors: [
        this.token("--ds-success", "green"),
        this.token("--ds-warning", "orange"),
      ],
    };
  });

  readonly restaurantMetrics = computed(() => {
    return this.dashboard()?.currentCharges?.restaurant;
  });

  readonly restaurantChartData = computed(() => {
    const m = this.restaurantMetrics();
    if (!m || m.total <= 0) {
      return null;
    }

    return {
      data: [
        { name: "Cobrado", value: m.collected },
        { name: "Pendiente", value: m.pending > 0 ? m.pending : 0 },
      ],
      colors: [
        this.token("--ds-success", "green"),
        this.token("--ds-warning", "orange"),
      ],
    };
  });

  constructor() {}

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
          void this.store.loadLocalData(
            customerId,
            this.currentYear(),
            this.currentMonth(),
            this.currentDay(),
            true,
          );
        }
      });
  }

  onOpenClasificacionDetail(row: {
    clasificacion: string;
    description: string;
    isTotal?: boolean;
    filterKey?: string;
  }) {
    const all = this.allDebtors();

    let departamentos: typeof all;
    const filterKey = row.filterKey ?? row.clasificacion;

    switch (filterKey) {
      case "COBRANZA_PERFECTA_ALL":
        // Fila total azul: todos los departamentos
        departamentos = [...all];
        break;
      case "COBRADO":
        // Cobrado = quienes ya pagaron (saldo 0 o negativo)
        departamentos = all.filter(
          (d) =>
            d.clasificacion === "SIN ADEUDO" || d.clasificacion === "ANTICIPOS",
        );
        break;
      case "TOTAL_DEUDA_ALL":
        // Fila total roja: todos los deudores con saldo > 0
        departamentos = all.filter((d) => d.balance > 0);
        break;
      default:
        departamentos = all.filter((d) => d.clasificacion === filterKey);
    }

    const data: ClasificacionDetailData = {
      clasificacion: row.clasificacion,
      description: row.description,
      departamentos,
    };

    void this.dialogHandlerS.openDialog(
      CobranzaOnlineClasificacionDetail,
      data,
      `Detalle: ${row.clasificacion} (${departamentos.length} deptos.)`,
      this.dialogHandlerS.sizeLg,
    );
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
}
