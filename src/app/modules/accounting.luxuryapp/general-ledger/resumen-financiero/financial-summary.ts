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
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  AspelBudgetDTO,
  CuentaAspelDetalladaDTO,
} from "../presupuesto-web-aspel/presupuestos.interfaces";
import { PurchaseHistory } from "../presupuesto-web-aspel/purchase-history";
import {
  getBudgetAccounts,
  getBudgetCompanyName,
  normalizeAspelAccounts,
  normalizeAspelBudgetResponse,
} from "../presupuesto-web-aspel/presupuesto-web-aspel.shared";

@Component({
  selector: "app-financial-summary",
  templateUrl: "./financial-summary.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, FormsModule, TableModule],
})
export class FinancialSummary {
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  loading = signal(true);
  errorMensaje: string | null = null;
  intYear: number = new Date().getFullYear();
  availableYears: number[] = [2024, 2025];
  preFormMonth: boolean = true;
  allMonths: boolean = false;
  readonly months: string[] = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  mesesVisibles: string[] = [...this.months];
  budgetData: AspelBudgetDTO | null = null;
  cuentasSignal = signal<CuentaAspelDetalladaDTO[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.cuentasSignal()));

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.cargarResumenFinanciero(customerId);
      }
    });
  }

  cargarResumenFinanciero(customerId: string): void {
    if (!customerId || !this.intYear) {
      this.handleError("Seleccione una empresa y un anio validos");
      return;
    }

    this.errorMensaje = null;
    this.cuentasSignal.set([]);
    this.budgetData = null;

    this.apiResponseS
      .onGetList(
        Endpoints.Presupuestos.aspelSummary(customerId, this.intYear),
      )
      .then((response: AspelBudgetDTO) => {
      const normalizedResponse = normalizeAspelBudgetResponse(response);
      const cuentas = normalizeAspelAccounts(
        getBudgetAccounts(normalizedResponse),
      );

      if (cuentas.length > 0) {
        this.budgetData = normalizedResponse;
        this.cuentasSignal.set(cuentas);
      } else {
        this.handleError(
          (normalizedResponse as any)?.strMensaje ||
            "No se encontraron datos para el resumen financiero.",
        );
        if (getBudgetCompanyName(normalizedResponse)) {
          this.budgetData = normalizedResponse;
        }
      }
    });
  }

  private handleError(message: string): void {
    this.errorMensaje = message;
    this.cuentasSignal.set([]);
    this.budgetData = null;
  }

  onSelectionChange(): void {
    const customerId = this.customerIdS.customerId();
    if (customerId) {
      this.cargarResumenFinanciero(customerId);
    }
  }

  toggleMes(mes: string): void {
    const index = this.mesesVisibles.indexOf(mes);
    if (index > -1) {
      this.mesesVisibles.splice(index, 1);
    } else {
      const newMesesVisibles = [...this.mesesVisibles, mes];
      this.mesesVisibles = this.months.filter((m) =>
        newMesesVisibles.includes(m),
      );
    }
  }

  isMesVisible(mes: string): boolean {
    return this.mesesVisibles.includes(mes);
  }

  mostrarTodosLosMeses(): void {
    this.allMonths = false;
    this.mesesVisibles = [...this.months];
  }

  ocultarTodosLosMeses(): void {
    this.allMonths = true;
    this.mesesVisibles = [];
  }

  sinFiltro(): void {
    const customerId = this.customerIdS.customerId();

    this.errorMensaje = null;
    this.cuentasSignal.set([]);
    this.budgetData = null;

    if (!customerId) {
      this.handleError("Seleccione una empresa y un anio validos");
      return;
    }

    this.apiResponseS
      .onGetList(
        Endpoints.Presupuestos.presupuestoLimpioEjercicioFiscal(
          customerId,
          this.intYear,
        ),
      )
      .then((response: AspelBudgetDTO) => {
      const normalizedResponse = normalizeAspelBudgetResponse(response);
      const cuentas = normalizeAspelAccounts(
        getBudgetAccounts(normalizedResponse),
      );

      if (cuentas.length > 0) {
        this.budgetData = normalizedResponse;
        this.cuentasSignal.set(cuentas);
      } else {
        this.handleError(
          (normalizedResponse as any)?.strMensaje ||
            "No se encontraron datos de cuentas detalladas o la respuesta no es valida.",
        );
        if (getBudgetCompanyName(normalizedResponse)) {
          this.budgetData = normalizedResponse;
        }
      }
    });
  }

  getMontoMes(cuenta: CuentaAspelDetalladaDTO, mes: string): number {
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const key = ("monto_" + mesCapitalizado) as keyof CuentaAspelDetalladaDTO;
    const value = cuenta[key];
    return typeof value === "number" ? value : 0;
  }

  getPresupuestoDelMes(cuenta: CuentaAspelDetalladaDTO, mes: string): number {
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const key = ("presup_" + mesCapitalizado) as keyof CuentaAspelDetalladaDTO;
    const value = cuenta[key];
    return typeof value === "number" ? value : 0;
  }

  getPresupuestoBaseMensual(cuenta: CuentaAspelDetalladaDTO): number {
    const meses = [
      "presup_Enero",
      "presup_Febrero",
      "presup_Marzo",
      "presup_Abril",
      "presup_Mayo",
      "presup_Junio",
      "presup_Julio",
      "presup_Agosto",
      "presup_Septiembre",
      "presup_Octubre",
      "presup_Noviembre",
      "presup_Diciembre",
    ];
    let vigente = 0;
    for (const mes of meses) {
      const valor = cuenta[mes];
      if (typeof valor === "number" && !Number.isNaN(valor)) {
        vigente = valor;
      }
    }
    return vigente;
  }

  getTotalMontoPorMes(mes: string): number {
    if (!this.budgetData) return 0;
    const capitalizedMes =
      mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    const key = ("total" + capitalizedMes + "Monto") as keyof AspelBudgetDTO;
    const value = this.budgetData[key];
    return typeof value === "number" ? value : 0;
  }

  getTotalPresupuestoBaseMensual(): number {
    return this.cuentasSignal()
      .filter((c) => !c.esFilaAgrupadora)
      .map((c) => this.getPresupuestoBaseMensual(c))
      .reduce((a, b) => a + b, 0);
  }

  getTotalPresupuestoDelMes(mes: string): number {
    return this.cuentasSignal()
      .filter((c) => !c.esFilaAgrupadora)
      .map((c) => this.getPresupuestoDelMes(c, mes))
      .reduce((a, b) => a + b, 0);
  }

  gastoExcedido(mes: string): boolean {
    const monto = this.getTotalMontoPorMes(mes);
    const presupuesto = this.getTotalPresupuestoDelMes(mes);
    return monto > presupuesto;
  }

  getSumaPresupuestoMesesVisiblesCuenta(
    cuenta: CuentaAspelDetalladaDTO,
  ): number {
    return this.mesesVisibles
      .map((mes) => this.getPresupuestoDelMes(cuenta, mes))
      .reduce((a, b) => a + b, 0);
  }

  getSumaGastoMesesVisiblesCuenta(cuenta: CuentaAspelDetalladaDTO): number {
    return this.mesesVisibles
      .map((mes) => this.getMontoMes(cuenta, mes))
      .reduce((a, b) => a + b, 0);
  }

  getPorcentajeGastadoMesesVisiblesCuenta(
    cuenta: CuentaAspelDetalladaDTO,
  ): number {
    const gasto = this.getSumaGastoMesesVisiblesCuenta(cuenta);
    const presupuesto = this.getSumaPresupuestoMesesVisiblesCuenta(cuenta);
    if (presupuesto === 0) return 0;
    return (gasto / presupuesto) * 100;
  }

  getSumaPresupuestoMesesVisibles(): number {
    return this.mesesVisibles
      .map((mes) => this.getTotalPresupuestoDelMes(mes))
      .reduce((a, b) => a + b, 0);
  }

  getSumaGastoMesesVisibles(): number {
    return this.mesesVisibles
      .map((mes) => this.getTotalMontoPorMes(mes))
      .reduce((a, b) => a + b, 0);
  }

  getPorcentajeGastadoMesesVisibles(): number {
    const gasto = this.getSumaGastoMesesVisibles();
    const presupuesto = this.getSumaPresupuestoMesesVisibles();
    if (presupuesto === 0) return 0;
    return (gasto / presupuesto) * 100;
  }

  getUltimoMesConGasto(): string | null {
    let ultimoMes: string | null = null;
    for (const mes of this.months) {
      const totalMes = this.getTotalMontoPorMes(mes);
      if (totalMes > 0) {
        ultimoMes = mes;
      }
    }
    return ultimoMes;
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
        fiscalYear: this.intYear,
        accountNumber: cuenta.codigo_Cuenta,
      },
      `HISTORIAL DE COMPRAS DE ${cuenta.descripcion_Cuenta}`,
      this.dialogHandlerS.sizeFull,
    );
  }
}
