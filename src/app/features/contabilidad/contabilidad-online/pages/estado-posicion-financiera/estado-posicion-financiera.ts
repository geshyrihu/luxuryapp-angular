import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SkeletonModule } from "primeng/skeleton";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";

import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { IEpfDTO } from "../../models/aspel-budget.interface";
import { reportFilterState } from "../../state/financial-report-filter.state";

/**
 * Componente EPF (Estado de Posición Financiera).
 *
 * Diseño de carga:
 *   - El backend recibe el mes de corte y devuelve el saldo acumulado al cierre de ese mes.
 *   - El componente recarga automáticamente al cambiar cliente, año O mes.
 *   - La respuesta es compacta: solo un valor (saldoCorte) por cuenta mayor.
 */
@Component({
  selector: "app-estado-posicion-financiera",
  imports: [CommonModule, FormsModule, SkeletonModule, CustomButton],
  templateUrl: "./estado-posicion-financiera.html",
})
export class EstadoPosicionFinanciera {
  private readonly apiS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  public readonly filterS = reportFilterState;

  private readonly MONTHS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // ── Estado ──────────────────────────────────────────────────────────────────
  loading = signal<boolean>(false);
  data = signal<IEpfDTO | null>(null);

  // ── Computed ─────────────────────────────────────────────────────────────────
  /** Nombre del mes seleccionado para el encabezado del reporte */
  selectedMonthName = computed(() => this.MONTHS[this.filterS.mesIdx()]);

  /** Cuentas de ACTIVO directamente de la respuesta del backend */
  epfActivo = computed(() => this.data()?.activo ?? []);

  /** Cuentas de PASIVO directamente de la respuesta del backend */
  epfPasivo = computed(() => this.data()?.pasivo ?? []);

  /** Cuentas de CAPITAL directamente de la respuesta del backend */
  epfCapital = computed(() => this.data()?.capital ?? []);

  /** Total ACTIVO calculado por el backend */
  totalActivo = computed(() => this.data()?.totalActivo ?? 0);

  /** Total PASIVO calculado por el backend */
  totalPasivo = computed(() => this.data()?.totalPasivo ?? 0);

  /** Total CAPITAL calculado por el backend */
  totalCapital = computed(() => this.data()?.totalCapital ?? 0);

  /** PASIVO + CAPITAL calculado por el backend */
  totalPasivoCapital = computed(() => this.data()?.totalPasivoCapital ?? 0);

  // ── Constructor / Lifecycle ──────────────────────────────────────────────────
  constructor() {
    // Recarga automática cuando cambia cliente, AÑO o MES
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      // mesIdx es 0-11; el backend espera 1-12
      const mes = this.filterS.mesIdx() + 1;
      if (custId && yr) {
        this.loadData(custId, yr, mes);
      }
    });
  }

  // ── Acciones públicas ────────────────────────────────────────────────────────
  onLoadReport() {
    const custId = this.customerIdS.customerId();
    const yr = this.filterS.year();
    const mes = this.filterS.mesIdx() + 1;
    if (custId && yr) {
      this.loadData(custId, yr, mes);
    }
  }

  // ── Carga de datos ───────────────────────────────────────────────────────────
  async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null); // limpiar datos anteriores mientras carga
    const result = await this.apiS.onGetItem<IEpfDTO>(
      // El endpoint compacto recibe: customerId / year / mes(1-12)
      Endpoints.ContabilidadOnline.FinancialStatements.epf(
        customerId,
        year,
        mes,
      ),
    );
    if (result) {
      this.data.set(result);
      this.filterS.currentReportName.set('Estado de Posición Financiera');
      this.filterS.currentReportContext.set(JSON.stringify(result));
    }
    this.loading.set(false);
  }
}
