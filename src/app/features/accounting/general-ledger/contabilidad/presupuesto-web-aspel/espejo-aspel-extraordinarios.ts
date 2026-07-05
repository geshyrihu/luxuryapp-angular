import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PresupuestoAspelExcelService } from "./presupuesto-aspel-excel.service";
import {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO,
} from "../models/presupuesto-shared.models";
import { PresupuestoWebAspelService } from "./presupuesto-web-aspel.service";
import {
  ASPEL_MONTHS,
  getCuentaMonthValue,
  getPresupuestoBaseMensual,
  hasAnyBudgetOrExpense,
  isParentAccount,
  normalizeAspelAccounts,
  splitAspelAccounts,
} from "./presupuesto-web-aspel.shared";
import { BudgetAccountRuleDataDTO } from "./presupuestos.interfaces";
import { PurchaseHistory } from "./purchase-history";

@Component({
  selector: "app-espejo-aspel-extraordinarios",
  templateUrl: "./espejo-aspel-extraordinarios.html",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    MessageModule,
    TagModule,
    DataViewMobile,
    TooltipModule,
  ],
})
export class EspejoAspelExtraordinarios {
  isClientView = input<boolean>(false);
  
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private excelService = inject(PresupuestoAspelExcelService);
  sharedS = inject(PresupuestoWebAspelService);

  loading = signal(true);
  readonly months: string[] = ASPEL_MONTHS;

  allExtraordinarias = signal<CuentaAspelTercerNivelDTO[]>([]);
  allProyectos = signal<CuentaAspelTercerNivelDTO[]>([]);

  globalFilterFields = signal<string[]>([]);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  extraordinarias = computed(() =>
    this.filterAccounts(
      this.filterAccountsWithBudgetOrExpense(this.allExtraordinarias()),
      this.sharedS.searchTerm(),
    ),
  );

  proyectos = computed(() =>
    this.filterAccounts(
      this.filterAccountsWithBudgetOrExpense(this.allProyectos()),
      this.sharedS.searchTerm(),
    ),
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const year = this.sharedS.intYear();
      if (customerId && year) {
        this.cargarDatos(customerId);
      }
    });
  }

  cargarDatos(customerId: string): void {
    if (!customerId || !this.sharedS.intYear()) {
      this.handleError("Seleccione un cliente y un Año vólidos");
      return;
    }

    this.loading.set(true);
    this.sharedS.errorMensaje.set(null);

    const urlBudget = `presupuesto/presupuesto-limpio-ejercicio-fiscal?customerId=${customerId}&intYear=${this.sharedS.intYear()}`;
    const urlRules = `BudgetAccountRules/${customerId}`;

    this.apiResponseS
      .onGetList<AspelBudgetDTO>(urlBudget)
      .then(async (response) => {
        if (response?.cuentas?.length > 0) {
          const rules =
            (await this.apiResponseS.onGetList<BudgetAccountRuleDataDTO[]>(
              urlRules,
            )) || [];
          const cuentas = normalizeAspelAccounts(response.cuentas);
          const grouped = splitAspelAccounts(
            cuentas,
            customerId,
            rules as BudgetAccountRuleDataDTO[],
          );

          this.sharedS.budgetData.set(response);
          this.allExtraordinarias.set(grouped.extraordinarias);
          this.allProyectos.set(grouped.proyectos);
          this.globalFilterFields.set(globalFilterFields(cuentas));
        } else {
          this.handleError(
            (response as any)?.strMensaje || "No se encontraron datos.",
          );
        }
        this.loading.set(false);
      })
      .catch(() => {
        this.handleError("Ocurrié un error al cargar los gastos especiales.");
        this.loading.set(false);
      });
  }

  private filterAccounts(
    cuentas: CuentaAspelTercerNivelDTO[],
    searchTerm: string,
  ): CuentaAspelTercerNivelDTO[] {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return cuentas;

    return cuentas.filter(
      (cuenta) =>
        cuenta.codigo_Cuenta.toLowerCase().includes(term) ||
        cuenta.descripcion_Cuenta.toLowerCase().includes(term),
    );
  }

  filterAccountsWithBudgetOrExpense(
    cuentas: CuentaAspelTercerNivelDTO[],
  ): CuentaAspelTercerNivelDTO[] {
    const visibleLeafAccounts = cuentas.filter(
      (cuenta) => !cuenta.esFilaAgrupadora && hasAnyBudgetOrExpense(cuenta),
    );
    const visibleParentCodes = new Set(
      visibleLeafAccounts.map((cuenta) => cuenta.cuenta_Padre).filter(Boolean),
    );

    const result = new Set(
      visibleLeafAccounts.map((cuenta) => cuenta.codigo_Cuenta),
    );

    for (const cuenta of cuentas) {
      if (!cuenta.esFilaAgrupadora) {
        continue;
      }

      if (visibleParentCodes.has(cuenta.codigo_Cuenta)) {
        result.add(cuenta.codigo_Cuenta);
      }
    }

    let changed = true;
    while (changed) {
      changed = false;

      for (const cuenta of cuentas) {
        if (!cuenta.esFilaAgrupadora || !cuenta.cuenta_Padre) {
          continue;
        }

        if (
          result.has(cuenta.codigo_Cuenta) &&
          !result.has(cuenta.cuenta_Padre)
        ) {
          result.add(cuenta.cuenta_Padre);
          changed = true;
        }
      }
    }

    return cuentas.filter((cuenta) => result.has(cuenta.codigo_Cuenta));
  }

  private handleError(message: string): void {
    this.sharedS.errorMensaje.set(message);
    this.allExtraordinarias.set([]);
    this.allProyectos.set([]);
    this.sharedS.budgetData.set(null);
  }

  onSelectionChange(): void {
    this.cargarDatos(this.customerIdS.customerId());
  }

  toggleMes(mes: string): void {
    this.sharedS.toggleMes(mes);
  }

  isMesVisible(mes: string): boolean {
    return this.sharedS.isMesVisible(mes);
  }

  mostrarTodosLosMeses(): void {
    this.sharedS.mostrarTodosLosMeses();
  }

  ocultarTodosLosMeses(): void {
    this.sharedS.ocultarTodosLosMeses();
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

  getTotalMontoPorMes(
    cuentas: CuentaAspelTercerNivelDTO[],
    mes: string,
  ): number {
    return cuentas
      .filter((cuenta) => !cuenta.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getMontoMes(cuenta, mes), 0);
  }

  getTotalPresupuestoBaseMensual(cuentas: CuentaAspelTercerNivelDTO[]): number {
    return cuentas
      .filter((cuenta) => !cuenta.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getPresupuestoBaseMensual(cuenta), 0);
  }

  getTotalPresupuestoDelMes(
    cuentas: CuentaAspelTercerNivelDTO[],
    mes: string,
  ): number {
    return cuentas
      .filter((cuenta) => !cuenta.esFilaAgrupadora)
      .reduce((sum, cuenta) => sum + this.getPresupuestoDelMes(cuenta, mes), 0);
  }

  getSumaPresupuestoMesesVisiblesCuenta(
    cuenta: CuentaAspelTercerNivelDTO,
  ): number {
    return this.sharedS
      .mesesSeleccionados()
      .reduce((sum, mes) => sum + this.getPresupuestoDelMes(cuenta, mes), 0);
  }

  getSumaGastoMesesVisiblesCuenta(cuenta: CuentaAspelTercerNivelDTO): number {
    return this.sharedS
      .mesesSeleccionados()
      .reduce((sum, mes) => sum + this.getMontoMes(cuenta, mes), 0);
  }

  getPorcentajeGastadoMesesVisiblesCuenta(
    cuenta: CuentaAspelTercerNivelDTO,
  ): number {
    const gasto = this.getSumaGastoMesesVisiblesCuenta(cuenta);
    const presupuesto = this.getSumaPresupuestoMesesVisiblesCuenta(cuenta);
    return presupuesto === 0 ? 0 : (gasto / presupuesto) * 100;
  }

  getSumaPresupuestoMesesVisibles(
    cuentas: CuentaAspelTercerNivelDTO[],
  ): number {
    return this.sharedS
      .mesesSeleccionados()
      .reduce(
        (sum, mes) => sum + this.getTotalPresupuestoDelMes(cuentas, mes),
        0,
      );
  }

  getSumaGastoMesesVisibles(cuentas: CuentaAspelTercerNivelDTO[]): number {
    return this.sharedS
      .mesesSeleccionados()
      .reduce((sum, mes) => sum + this.getTotalMontoPorMes(cuentas, mes), 0);
  }

  getPresupuestoRestanteMesesVisibles(
    cuentas: CuentaAspelTercerNivelDTO[],
  ): number {
    return (
      this.getSumaPresupuestoMesesVisibles(cuentas) -
      this.getSumaGastoMesesVisibles(cuentas)
    );
  }

  gastoExcedido(cuentas: CuentaAspelTercerNivelDTO[], mes: string): boolean {
    const monto = this.getTotalMontoPorMes(cuentas, mes);
    const presupuesto = this.getTotalPresupuestoDelMes(cuentas, mes);
    return presupuesto > 0 && monto > presupuesto;
  }

  showPurchaseHistory(cuenta: CuentaAspelTercerNivelDTO) {
    this.dialogHandlerS.openDialog(
      PurchaseHistory,
      {
        fiscalYear: this.sharedS.intYear(),
        accountNumber: cuenta.codigo_Cuenta,
      },
      `HISTORIAL DE COMPRAS DE ${cuenta.descripcion_Cuenta}`,
      this.dialogHandlerS.sizeFull,
    );
  }

  exportExcel(): void {
    const ext  = this.filterAccountsWithBudgetOrExpense(this.allExtraordinarias());
    const proj = this.filterAccountsWithBudgetOrExpense(this.allProyectos());
    this.excelService.exportEspeciales(
      ext,
      proj,
      this.sharedS.budgetData(),
      this.sharedS.intYear(),
    );
  }

  isParentAccount(cuenta: CuentaAspelTercerNivelDTO): boolean {
    return isParentAccount(cuenta);
  }
}
