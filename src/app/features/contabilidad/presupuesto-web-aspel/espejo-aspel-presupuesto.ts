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
import { PresupuestoSharedService } from "../services/presupuesto-shared.service";
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
  // ===========================
  // Servicios inyectados
  // ===========================
  apiResponseS = inject(ApiResponseService);
  private sharedService = inject(PresupuestoSharedService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);

  // ===========================
  // Mótodos Nuevos
  // ===========================
  onManageRules() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) {
      this.handleError("Seleccione un cliente vólido.");
      return;
    }

    this.dialogHandlerS
      .openDialog(
        BudgetRuleList,
        { customerId: customerId },
        "Gestión de Reglas de Presupuesto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) {
          this.cargarPresupuesto(customerId);
        } else {
          this.cargarPresupuesto(customerId);
        }
      });
  }
  // ===========================
  // Propiedades de estado general
  // ===========================
  // ===========================
  // Propiedades de estado general
  // ===========================
  loading = signal(true);
  errorMensaje = signal<string | null>(null);

  // ===========================
  // Propiedades de cliente y Año
  // ===========================
  intYear = signal<number>(new Date().getFullYear());
  availableYears: ISelectItem[] = ASPEL_AVAILABLE_YEARS;

  // ===========================
  // Propiedades de control de meses
  // ===========================
  preFormMonth: boolean = true;
  allMonths = signal(true);
  readonly months: string[] = ASPEL_MONTHS;
  mesesSeleccionados: string[] = [...this.months];

  // ===========================
  // Propiedades de datos principales (Signals)
  // ===========================
  budgetData = signal<AspelBudgetDTO | null>(null);
  allCuentas = signal<CuentaAspelTercerNivelDTO[]>([]); // Lista maestra

  // ===========================
  // Computed: Cuentas Filtradas
  // ===========================
  cuentas = computed(() => {
    const grouped = splitAspelAccounts(
      this.allCuentas(),
      this.customerIdS.customerId(),
    );
    return grouped.mantenimiento;
  });

  // ===========================
  // Propiedades de configuración de tabla
  // ===========================
  globalFilterFields = signal<string[]>([]);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  // ===========================
  // Ciclo de vida
  // ===========================
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
      this.handleError("Seleccione un cliente y un Año vólidos");
      return;
    }

    this.errorMensaje.set(null);
    this.loading.set(true);

    this.sharedService
      .getAspelQuotation(customerId, this.intYear())
      .then((response: AspelBudgetDTO) => {
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
        this.loading.set(false);
      })
      .catch(() => this.loading.set(false));
  }

  private handleError(message: string): void {
    this.errorMensaje.set(message);
    this.allCuentas.set([]);
    this.budgetData.set(null);
  }

  onApelFull() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId || !this.intYear()) {
      this.handleError("Seleccione un cliente y un Año vólidos");
      return;
    }

    this.errorMensaje.set(null);
    this.allCuentas.set([]);
    this.budgetData.set(null);

    this.sharedService
      .getAspelFullQuotation(customerId, this.intYear())
      .then((response: AspelBudgetDTO) => {
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
      });
  }

  // ===========================
  // Mótodos de obtención de montos (Actualizados a snake_case)
  // ===========================

  getMontoMes(cuenta: CuentaAspelTercerNivelDTO, mes: string): number {
    return getCuentaMonthValue(cuenta, mes, "monto");
  }

  getPresupuestoDelMes(cuenta: CuentaAspelTercerNivelDTO, mes: string): number {
    return getCuentaMonthValue(cuenta, mes, "presup");
  }

  getPresupuestoBaseMensual(cuenta: CuentaAspelTercerNivelDTO): number {
    return getPresupuestoBaseMensual(cuenta);
  }

  // ===========================
  // Mótodos de Interacción UI (sin cambios)
  // ===========================
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

  sinFiltro(): void {
    const customerId: string = this.customerIdS.customerId();
    this.errorMensaje.set(null);
    this.allCuentas.set([]);
    this.budgetData.set(null);

    this.sharedService
      .getPresupuestoLimpioEjercicioFiscal(customerId, this.intYear())
      .then((response: AspelBudgetDTO) => {
        if (response && response.cuentas && response.cuentas.length > 0) {
          this.budgetData.set(response);
          this.allCuentas.set(normalizeAspelAccounts(this.budgetData()!.cuentas));
          this.globalFilterFields.set(globalFilterFields(this.allCuentas()));
        } else {
          this.handleError(
            (response as any)?.strMensaje ||
              "No se encontraron datos de cuentas detalladas o la respuesta no es vólida.",
          );
          if (response && response.Nombre_Empresa) {
            this.budgetData.set(response);
          }
        }
      });
  }

  // ===========================
  // MóTODOS DE CóLCULO (CORREGIDOS)
  // Todas las funciones ahora iteran sobre `this.cuentas()` (la lista filtrada)
  // ===========================

  getTotalMontoPorMes(mes: string): number {
    const cuentas = this.cuentas(); // Access signal
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

  // ===========================
  // 🤖 IA Financial Analyst
  // ===========================

  async analyzeFinancialData() {
    const cuentas = this.cuentas(); // Access signal
    if (!cuentas || cuentas.length === 0) {
      this.swalService.fire({
        icon: "warning",
        title: "Atención",
        text: "No hay datos visibles para analizar.",
      });
      return;
    }

    const context = this.getFinancialContext();

    // Mostrar loader manual porque usamos onPostNotLoading
    this.swalService.fire({
      title: "🤖 Analizando Finanzas...",
      text: "El asistente estó revisando los nómeros. Esto puede tardar unos segundos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        // Fix z-index si es necesario, aunque aquó no hay modal previo
      },
    });

    try {
      const result = await this.aiService.analyzeFinancialData(
        context,
        "Profesional",
      );

      this.swalService.fire({
        title: "🤖 Resumen Ejecutivo IA",
        html: `<div class="text-left">${result}</div>`,
        width: "600px",
        icon: "info",
        confirmButtonText: "Entendido",
      });
    } catch (error) {
      console.error(error);
      this.swalService.error("Ocurrió un error al generar el anólisis.");
    }
  }

  private getFinancialContext(): string {
    const totalPresupuesto = this.getSumaPresupuestoMesesVisibles();
    const totalGasto = this.getSumaGastoMesesVisibles();
    const porcentajeGlobal = this.getPorcentajeGastadoMesesVisibles();

    // Filtrar cuentas hoja (no agrupadoras) con mayor desviación (gasto > presupuesto)
    const cuentasCriticas = this.cuentas() // Access signal
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
      .filter((x) => x.diferencia > 0) // Solo las que se excedieron
      .sort((a, b) => b.diferencia - a.diferencia) // Ordenar por mayor desviación
      .slice(0, 5); // Top 5

    let context = `
    Resumen Global del Periodo Seleccionado:
    - Presupuesto Total: $${totalPresupuesto.toFixed(2)}
    - Gasto Total: $${totalGasto.toFixed(2)}
    - % Ejercido: ${porcentajeGlobal.toFixed(2)}%

    Top 5 Cuentas con Mayor Desviación (Sobregasto):
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
