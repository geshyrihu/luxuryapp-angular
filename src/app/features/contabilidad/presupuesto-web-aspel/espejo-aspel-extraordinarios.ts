import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
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
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  AspelBudgetDTO,
  CuentaAspelTercerNivelDTO,
} from "../models/presupuesto-shared.models";
import { BudgetAccountRuleDataDTO } from "./presupuestos.interfaces";
import {
  ASPEL_AVAILABLE_YEARS,
  ASPEL_MONTHS,
  getCuentaMonthValue,
  getPresupuestoBaseMensual,
  hasAnyExpense,
  isParentAccount,
  normalizeAspelAccounts,
  splitAspelAccounts,
} from "./presupuesto-web-aspel.shared";
import { PurchaseHistory } from "./purchase-history";

@Component({
  selector: "app-espejo-aspel-extraordinarios",
  templateUrl: "./espejo-aspel-extraordinarios.html",
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
})
export class EspejoAspelExtraordinarios {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);

  loading = signal(true);
  errorMensaje = signal<string | null>(null);
  searchTerm = signal("");

  intYear = signal<number>(new Date().getFullYear());
  availableYears: ISelectItem[] = ASPEL_AVAILABLE_YEARS;

  allMonths = signal(true);
  readonly months: string[] = ASPEL_MONTHS;
  mesesSeleccionados: string[] = [...this.months];

  budgetData = signal<AspelBudgetDTO | null>(null);
  allExtraordinarias = signal<CuentaAspelTercerNivelDTO[]>([]);
  allProyectos = signal<CuentaAspelTercerNivelDTO[]>([]);

  globalFilterFields = signal<string[]>([]);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  extraordinarias = computed(() =>
    this.filterAccounts(
      this.filterAccountsWithExpense(this.allExtraordinarias()),
      this.searchTerm(),
    ),
  );

  proyectos = computed(() =>
    this.filterAccounts(
      this.filterAccountsWithExpense(this.allProyectos()),
      this.searchTerm(),
    ),
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.cargarDatos(customerId);
      }
    });
  }

  cargarDatos(customerId: string): void {
    if (!customerId || !this.intYear()) {
      this.handleError("Seleccione un cliente y un Año válidos");
      return;
    }

    this.loading.set(true);
    this.errorMensaje.set(null);

    const urlBudget = `presupuesto/presupuesto-limpio-ejercicio-fiscal?customerId=${customerId}&intYear=${this.intYear()}`;
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

          this.budgetData.set(response);
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
        this.handleError("Ocurrió un error al cargar los gastos especiales.");
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

  private filterAccountsWithExpense(
    cuentas: CuentaAspelTercerNivelDTO[],
  ): CuentaAspelTercerNivelDTO[] {
    const visibleLeafAccounts = cuentas.filter(
      (cuenta) => !cuenta.esFilaAgrupadora && hasAnyExpense(cuenta),
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
    this.errorMensaje.set(message);
    this.allExtraordinarias.set([]);
    this.allProyectos.set([]);
    this.budgetData.set(null);
  }

  onSelectionChange(): void {
    this.cargarDatos(this.customerIdS.customerId());
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

  getSumaPresupuestoMesesVisibles(cuentas: CuentaAspelTercerNivelDTO[]): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getTotalPresupuestoDelMes(cuentas, mes),
      0,
    );
  }

  getSumaGastoMesesVisibles(cuentas: CuentaAspelTercerNivelDTO[]): number {
    return this.mesesSeleccionados.reduce(
      (sum, mes) => sum + this.getTotalMontoPorMes(cuentas, mes),
      0,
    );
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
        fiscalYear: this.intYear(),
        accountNumber: cuenta.codigo_Cuenta,
      },
      `HISTORIAL DE COMPRAS DE ${cuenta.descripcion_Cuenta}`,
      this.dialogHandlerS.sizeFull,
    );
  }

  isParentAccount(cuenta: CuentaAspelTercerNivelDTO): boolean {
    return isParentAccount(cuenta);
  }
}
