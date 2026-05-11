import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import type {
  ReporteFinancieroFila,
  ReporteFinancieroResponse,
} from "../../models/cobranza-online-reporte-financiero.model";

interface OpcionMes {
  label: string;
  value: number;
}

const MESES_OPCIONES: OpcionMes[] = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 },
];

@Component({
  selector: "app-cobranza-online-reporte-financiero",
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
  templateUrl: "./cobranza-online-reporte-financiero.html",
  styles: `
    :host {
      --rf-ink: #0f172a;
      --rf-muted: #64748b;
      --rf-line: #e2e8f0;
      --rf-soft: #f8fafc;
      --rf-accent: #1e3a5f;
      --rf-total-bg: #e8eef5;
      --rf-result-bg: #1e3a5f;
      --rf-result-ink: #ffffff;
      --rf-fondo-bg: #f0f4f8;
      --rf-header-bg: #c8d8ea;
    }

    .rf-shell {
      font-family: "Inter", "Segoe UI", sans-serif;
      color: var(--rf-ink);
    }

    .rf-card {
      background: #fff;
      border: 1px solid var(--rf-line);
      border-radius: 14px;
      box-shadow: 0 4px 18px rgba(15, 23, 42, 0.06);
    }

    /* ---- Tabla ---- */
    .rf-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    .rf-table th,
    .rf-table td {
      padding: 0.36rem 0.75rem;
      text-align: right;
      white-space: nowrap;
      border-bottom: 1px solid var(--rf-line);
    }

    .rf-table th:first-child,
    .rf-table td:first-child {
      text-align: left;
      min-width: 220px;
    }

    .rf-table th {
      background: var(--rf-header-bg);
      color: var(--rf-accent);
      font-weight: 700;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #b0c4de;
    }

    /* Filas de concepto */
    .rf-row-concepto td {
      background: #fff;
    }

    /* Filas de seccion */
    .rf-row-seccion td {
      background: var(--rf-soft);
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--rf-accent);
      border-top: 2px solid var(--rf-line);
      border-bottom: 1px solid var(--rf-line);
    }

    /* Totales */
    .rf-row-total td {
      background: var(--rf-total-bg);
      font-weight: 800;
    }

    /* Resultado del periodo */
    .rf-row-resultado td {
      background: var(--rf-result-bg);
      color: var(--rf-result-ink);
      font-weight: 800;
      font-size: 0.88rem;
    }

    /* Fondo para mejoras */
    .rf-row-fondo-header td {
      background: #c8d8ea;
      font-weight: 800;
      color: var(--rf-accent);
      text-transform: uppercase;
      font-size: 0.8rem;
      border-top: 3px solid var(--rf-accent);
    }

    .rf-row-fondo-total td {
      background: #b0c4de;
      font-weight: 800;
    }

    /* Columna SUMA */
    .rf-col-suma {
      background: rgba(30, 58, 95, 0.04) !important;
      font-weight: 700;
    }

    /* Numeros negativos */
    .rf-neg {
      color: #b91c1c;
    }

    /* Toolbar */
    .rf-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: flex-end;
    }

    .rf-field {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .rf-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--rf-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Scroll horizontal en movil */
    .rf-table-wrap {
      overflow-x: auto;
    }

    /* Vacio y cargando */
    .rf-empty {
      text-align: center;
      padding: 3rem;
      color: var(--rf-muted);
    }
  `,
})
export class CobranzaOnlineReporteFinanciero {
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly mesInicio = signal(1);
  readonly mesFin = signal(new Date().getMonth() + 1);
  readonly loading = signal(false);
  readonly data = signal<ReporteFinancieroResponse | null>(null);

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly mesesOpciones = MESES_OPCIONES;

  readonly yearsOptions = computed(() => {
    const current = new Date().getFullYear();
    return [current, current - 1, current - 2].map((y) => ({
      label: String(y),
      value: y,
    }));
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.data.set(null);
        return;
      }
      void this.loadData(customerId);
    });
  }

  async onConsultar() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    await this.loadData(customerId);
  }

  private async loadData(customerId: string) {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetItem<ReporteFinancieroResponse>(
      Endpoints.AccountingCoi.CobranzaOnline.ReporteFinanciero.get(
        customerId,
        this.currentYear(),
        this.mesInicio(),
        this.mesFin(),
      ),
      false,
    );
    this.data.set((result as ReporteFinancieroResponse | null) ?? null);
    this.loading.set(false);
  }

  // -------------------------------------------------------------------------
  // Helpers de formato
  // -------------------------------------------------------------------------

  formatNum(value: number): string {
    if (value === 0 || value === null || value === undefined) return "-";
    return new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  isNeg(value: number): boolean {
    return value < 0;
  }

  isLastCol(index: number, cols: number): boolean {
    return index === cols - 1;
  }

  /** Devuelve true si todos los valores de la fila son cero */
  isFilaVacia(fila: ReporteFinancieroFila): boolean {
    return fila.valores.every((v) => v === 0);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
