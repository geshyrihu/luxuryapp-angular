import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SwalService } from "src/app/core/services/swal.service";
import Swal from "sweetalert2";
import {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO,
} from "../models/presupuesto-shared.models";
import { BudgetRuleList } from "../presupuesto-propuesta/budget-rule-list/budget-rule-list";
import {
  ASPEL_AVAILABLE_YEARS,
  ASPEL_MONTHS,
  getCuentaMonthValue,
  getPresupuestoBaseMensual,
  isParentAccount,
  normalizeAspelAccounts,
  splitAspelAccounts,
} from "./presupuesto-web-aspel.shared";
import { PurchaseHistory } from "./purchase-history";

@Component({
  selector: "app-presupuesto-aspel-ejercicio-fiscal",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CustomInputSelectSignal,
    MessageModule,
    TagModule,
    CustomButton,
    CustomSearchInput,
    DataViewMobile,
    TooltipModule,
  ],
  templateUrl: "./espejo-aspel-presupuesto.html",
  animations: [
    trigger("rowAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate(
          "300ms ease-out",
          style({ opacity: 1, transform: "translateY(0)" }),
        ),
      ]),
      transition(":leave", [
        animate(
          "300ms ease-in",
          style({ opacity: 0, transform: "translateY(-10px)" }),
        ),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PresupuestoAspelEjercicioFiscal {
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);

  onManageRules() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) {
      this.handleError("Seleccione un cliente valido.");
      this.loading.set(false);
      return;
    }

    this.dialogHandlerS
      .openDialog(
        BudgetRuleList,
        { customerId },
        "Gestion de Reglas de Presupuesto",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.cargarPresupuesto(customerId);
      });
  }

  loading = signal(true);
  errorMensaje = signal<string | null>(null);

  intYear = signal<number>(new Date().getFullYear());
  availableYears: ISelectItem[] = ASPEL_AVAILABLE_YEARS;

  preFormMonth = true;
  allMonths = signal(true);
  readonly months: string[] = ASPEL_MONTHS;
  mesesSeleccionados: string[] = [...this.months];

  budgetData = signal<AspelBudgetDTO | null>(null);
  allCuentas = signal<CuentaAspelTercerNivelDTO[]>([]);

  cuentas = computed(() => {
    const grouped = splitAspelAccounts(
      this.allCuentas(),
      this.customerIdS.customerId(),
    );
    return grouped.mantenimiento;
  });

  globalFilterFields = signal<string[]>([]);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.cargarPresupuesto(customerId);
      }
    });
  }

  cargarPresupuesto(customerId: string): void {
    if (!customerId || !this.intYear()) {
      this.loading.set(false);
      this.handleError("Seleccione un cliente y un anio validos");
      return;
    }

    this.errorMensaje.set(null);
    this.loading.set(true);

    const url = `presupuesto/aspel?customerId=${customerId}&intYear=${this.intYear()}`;

    this.apiResponseS
      .onGetList<AspelBudgetDTO>(url)
      .then((response) => {
        if (response?.cuentas?.length > 0) {
          this.budgetData.set(response);
          this.allCuentas.set(normalizeAspelAccounts(response.cuentas));
          this.globalFilterFields.set(globalFilterFields(this.allCuentas()));
        } else {
          this.handleError(
            (response as any)?.strMensaje || "No se encontraron datos.",
          );
          if (response?.Nombre_Empresa) {
            this.budgetData.set(response);
          }
        }
      })
      .catch(() => {
        this.handleError("Ocurrio un error al cargar el presupuesto.");
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  private handleError(message: string): void {
    this.errorMensaje.set(message);
    this.allCuentas.set([]);
    this.budgetData.set(null);
  }

  onApelFull() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId || !this.intYear()) {
      this.handleError("Seleccione un cliente y un anio validos");
      this.loading.set(false);
      return;
    }

    this.errorMensaje.set(null);
    this.allCuentas.set([]);
    this.budgetData.set(null);

    const url = `presupuesto/aspel-full?customerId=${customerId}&intYear=${this.intYear()}`;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<AspelBudgetDTO>(url)
      .then((response) => {
        if (response?.cuentas?.length > 0) {
          this.budgetData.set(response);
          this.allCuentas.set(normalizeAspelAccounts(response.cuentas));
          this.globalFilterFields.set(globalFilterFields(this.allCuentas()));
        } else {
          this.handleError(
            (response as any)?.strMensaje || "No se encontraron datos.",
          );
          if (response?.Nombre_Empresa) {
            this.budgetData.set(response);
          }
        }
      })
      .catch(() => {
        this.handleError("Ocurrio un error al cargar la vista completa.");
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  getMontoMes(cuenta: CuentaAspelTercerNivelDTO, mes: string): number {
    return getCuentaMonthValue(cuenta, mes, "monto");
  }

  getPresupuestoDelMes(cuenta: CuentaAspelTercerNivelDTO, mes: string): number {
    return getCuentaMonthValue(cuenta, mes, "presup");
  }

  getPresupuestoBaseMensual(cuenta: CuentaAspelTercerNivelDTO): number {
    return getPresupuestoBaseMensual(cuenta);
  }

  onSelectionChange(): void {
    this.cargarPresupuesto(this.customerIdS.customerId());
  }

  toggleMes(mes: string): void {
    const index = this.mesesSeleccionados.indexOf(mes);
    if (index > -1) {
      this.mesesSeleccionados.splice(index, 1);
    } else {
      const newMesesSeleccionados = [...this.mesesSeleccionados, mes];
      this.mesesSeleccionados = this.months.filter((m) =>
        newMesesSeleccionados.includes(m),
      );
    }
  }

  isMesVisible(mes: string): boolean {
    return this.mesesSeleccionados.includes(mes);
  }

  mostrarTodosLosMeses(): void {
    this.allMonths.set(true);
    this.mesesSeleccionados = [...this.months];
  }

  ocultarTodosLosMeses(): void {
    this.allMonths.set(false);
    this.mesesSeleccionados = [];
  }

  /**
   * Legacy helper conservado por compatibilidad manual.
   * Actualmente no hay disparador visible en la plantilla activa.
   */
  sinFiltro(): void {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId || !this.intYear()) {
      this.loading.set(false);
      this.handleError("Seleccione un cliente y un anio validos");
      return;
    }

    this.errorMensaje.set(null);
    this.allCuentas.set([]);
    this.budgetData.set(null);

    const url = `presupuesto/presupuesto-limpio-ejercicio-fiscal?customerId=${customerId}&intYear=${this.intYear()}`;

    this.loading.set(true);
    this.apiResponseS
      .onGetList<AspelBudgetDTO>(url)
      .then((response) => {
        if (response?.cuentas?.length > 0) {
          this.budgetData.set(response);
          this.allCuentas.set(normalizeAspelAccounts(response.cuentas));
          this.globalFilterFields.set(globalFilterFields(this.allCuentas()));
        } else {
          this.handleError(
            (response as any)?.strMensaje ||
              "No se encontraron datos de cuentas detalladas o la respuesta no es valida.",
          );
          if (response?.Nombre_Empresa) {
            this.budgetData.set(response);
          }
        }
      })
      .catch(() => {
        this.handleError("Ocurrio un error al cargar la vista sin filtro.");
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  getTotalMontoPorMes(mes: string): number {
    const cuentas = this.cuentas();
    if (!cuentas) return 0;
    return cuentas
      .filter((c) => !c.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getMontoMes(cuenta, mes), 0);
  }

  getTotalPresupuestoBaseMensual(): number {
    return this.cuentas()
      .filter((c) => !c.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getPresupuestoBaseMensual(cuenta), 0);
  }

  getTotalPresupuestoDelMes(mes: string): number {
    return this.cuentas()
      .filter((c) => !c.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getPresupuestoDelMes(cuenta, mes), 0);
  }

  gastoExcedido(mes: string): boolean {
    const monto = this.getTotalMontoPorMes(mes);
    const presupuesto = this.getTotalPresupuestoDelMes(mes);
    return presupuesto > 0 && monto > presupuesto;
  }

  getSumaPresupuestoMesesVisiblesCuenta(
    cuenta: CuentaAspelTercerNivelDTO,
  ): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getPresupuestoDelMes(cuenta, mes),
      0,
    );
  }

  getSumaGastoMesesVisiblesCuenta(cuenta: CuentaAspelTercerNivelDTO): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getMontoMes(cuenta, mes),
      0,
    );
  }

  getPorcentajeGastadoMesesVisiblesCuenta(
    cuenta: CuentaAspelTercerNivelDTO,
  ): number {
    const gasto = this.getSumaGastoMesesVisiblesCuenta(cuenta);
    const presupuesto = this.getSumaPresupuestoMesesVisiblesCuenta(cuenta);
    return presupuesto === 0 ? 0 : (gasto / presupuesto) * 100;
  }

  getSumaPresupuestoMesesVisibles(): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getTotalPresupuestoDelMes(mes),
      0,
    );
  }

  getSumaGastoMesesVisibles(): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getTotalMontoPorMes(mes),
      0,
    );
  }

  getPorcentajeGastadoMesesVisibles(): number {
    const gasto = this.getSumaGastoMesesVisibles();
    const presupuesto = this.getSumaPresupuestoMesesVisibles();
    return presupuesto === 0 ? 0 : (gasto / presupuesto) * 100;
  }

  getPresupuestoRestanteMesesVisibles(): number {
    return (
      this.getSumaPresupuestoMesesVisibles() - this.getSumaGastoMesesVisibles()
    );
  }

  showPurchaseHistory(cuenta: any) {
    this.dialogHandlerS.openDialog(
      PurchaseHistory,
      {
        fiscalYear: this.intYear(),
        accountNumber: cuenta.codigo_Cuenta,
      },
      `HISTORIAL DE COMPRAS DE ${cuenta.descripcion_Cuenta}`,
      this.dialogHandlerS.sizeFull,
    );
  }

  async analyzeFinancialData() {
    const cuentas = this.cuentas();
    if (!cuentas || cuentas.length === 0) {
      this.swalService.fire({
        icon: "warning",
        title: "Atencion",
        text: "No hay datos visibles para analizar.",
      });
      return;
    }

    const context = this.getFinancialContext();

    this.swalService.fire({
      title: "Analizando finanzas...",
      text: "El asistente esta revisando los numeros. Esto puede tardar unos segundos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await this.aiService.analyzeFinancialData(
        context,
        "Profesional",
      );

      this.swalService.fire({
        title: "Resumen ejecutivo IA",
        html: `<div class="text-left">${result}</div>`,
        width: "600px",
        icon: "info",
        confirmButtonText: "Entendido",
      });
    } catch (error) {
      console.error(error);
      this.swalService.error("Ocurrio un error al generar el analisis.");
    }
  }

  private getFinancialContext(): string {
    const totalPresupuesto = this.getSumaPresupuestoMesesVisibles();
    const totalGasto = this.getSumaGastoMesesVisibles();
    const porcentajeGlobal = this.getPorcentajeGastadoMesesVisibles();

    const cuentasCriticas = this.cuentas()
      .filter((c) => !c.esFilaAgrupadora)
      .map((c) => {
        const p = this.getSumaPresupuestoMesesVisiblesCuenta(c);
        const g = this.getSumaGastoMesesVisiblesCuenta(c);
        return {
          cuenta: c.descripcion_Cuenta,
          presupuesto: p,
          gasto: g,
          diferencia: g - p,
        };
      })
      .filter((x) => x.diferencia > 0)
      .sort((a, b) => b.diferencia - a.diferencia)
      .slice(0, 5);

    let context = `
    Resumen Global del Periodo Seleccionado:
    - Presupuesto Total: $${totalPresupuesto.toFixed(2)}
    - Gasto Total: $${totalGasto.toFixed(2)}
    - % Ejercido: ${porcentajeGlobal.toFixed(2)}%

    Top 5 Cuentas con Mayor Desviacion (Sobregasto):
    `;

    cuentasCriticas.forEach((c) => {
      context += `- ${c.cuenta}: Gasto $${c.gasto.toFixed(2)} (Presupuesto: $${c.presupuesto.toFixed(2)}, Excedido: $${c.diferencia.toFixed(2)})\n`;
    });

    if (cuentasCriticas.length === 0) {
      context += "No hay cuentas con sobregasto significativo.";
    }

    return context;
  }

  isParentAccount(cuenta: CuentaAspelTercerNivelDTO): boolean {
    return isParentAccount(cuenta);
  }
}
