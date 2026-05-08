import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  AspelBudgetDTO,
  CuentaAspelDetalladaDTO,
} from "../presupuesto-web-aspel/presupuestos.interfaces";
import { PurchaseHistory } from "../presupuesto-web-aspel/purchase-history";
@Component({
  selector: "app-financial-summary",
  templateUrl: "./financial-summary.html",
  imports: [CommonModule, FormsModule, TableModule],
})
export class FinancialSummary {
  // ===========================
  // Servicios (igual que antes)
  // ===========================
  apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  // ===========================
  // Propiedades de estado (igual que antes)
  // ===========================
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

  // ===========================
  // Ciclo de vida (igual que antes)
  // ===========================
  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        const empresaId = this.onMatchCustomerId(customerId);
        if (empresaId) {
          this.cargarResumenFinanciero(empresaId); // Llamamos al nuevo método
        } else {
          this.handleError("No se pudo determinar la empresa para el cliente");
        }
      }
    });
  }

  // ===========================
  // Carga de Datos (¡LA PARTE CLAVE!)
  // ===========================

  /**
   * Carga el RESUMEN del presupuesto de la empresa y año seleccionados.
   * @param intEmpresa ID de la empresa
   */
  cargarResumenFinanciero(intEmpresa: number): void {
    if (!intEmpresa || !this.intYear) {
      this.handleError("Seleccione una empresa y un año válidos");
      return;
    }

    this.errorMensaje = null;
    this.cuentasSignal.set([]);
    this.budgetData = null;

    // ¡AQUÍ ESTÁ LA MAGIA! Usamos el nuevo endpoint de resumen.
    const urlApi = `presupuesto/aspel-summary`;
    const url = `${urlApi}?intEmpresa=${intEmpresa}&intYear=${this.intYear}`;

    this.apiResponseS.onGetList(url).then((response: AspelBudgetDTO) => {
      if (response && response.cuentas && response.cuentas.length > 0) {
        // Los datos ya vienen listos para mostrar. No se necesita más procesamiento.
        this.budgetData = response;
        this.cuentasSignal.set(this.budgetData.cuentas);
      } else {
        this.handleError(
          (response as any)?.strMensaje ||
            "No se encontraron datos para el resumen financiero.",
        );
        if (response && response.Nombre_Empresa) {
          this.budgetData = response;
        }
      }
    });
  }

  // ===========================
  // Métodos de ayuda y UI (¡SE REUTILIZAN TODOS!)
  // La belleza es que estos métodos funcionan igual, porque operan sobre las
  // propiedades del DTO, que ahora contienen los valores agregados.
  // ===========================

  // ===========================
  // Métodos de mapeo y carga de datos
  // ===========================

  /**
   * Mapea el customerId al id de empresa correspondiente.
   * @param customerId ID del cliente
   * @returns ID de la empresa o undefined si no existe
   */
  private onMatchCustomerId(customerId: string): number | undefined {
    const customerToEmpresaMap: { [key: number]: number } = {
      10: 8,
      14: 5,
      19: 9,
      25: 10,
      3: 1,
      4: 4,
      41: 2,
      61: 7,
      64: 6,
      65: 3,
      69: 69,
    };
    return customerToEmpresaMap[customerId];
  }

  /**
   * Maneja errores de carga y limpia los datos.
   * @param message Mensaje de error a mostrar
   */
  private handleError(message: string): void {
    this.errorMensaje = message;
    this.cuentasSignal.set([]);
    this.budgetData = null;
  }

  onSelectionChange(): void {
    const empresaId = this.onMatchCustomerId(this.customerIdS.customerId());
    if (empresaId) {
      this.cargarResumenFinanciero(empresaId);
    }
  }

  /**
   * Alterna la visibilidad de un mes específico.
   * @param mes Nombre del mes en minúsculas
   */
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

  /**
   * Verifica si un mes está visible actualmente.
   * @param mes Nombre del mes en minúsculas
   * @returns true si el mes está visible, false si no
   */
  isMesVisible(mes: string): boolean {
    return this.mesesVisibles.includes(mes);
  }

  /**
   * Muestra todos los meses en la tabla.
   */
  mostrarTodosLosMeses(): void {
    this.allMonths = false;
    this.mesesVisibles = [...this.months];
  }

  /**
   * Oculta todos los meses en la tabla.
   */
  ocultarTodosLosMeses(): void {
    this.allMonths = true;
    this.mesesVisibles = [];
  }

  /**
   * Limpia los filtros y recarga los datos sin filtro.
   */
  sinFiltro(): void {
    const empresaId = this.onMatchCustomerId(this.customerIdS.customerId());

    this.errorMensaje = null;
    this.cuentasSignal.set([]);
    this.budgetData = null; // Limpiar datos anteriores

    const urlApi = `presupuesto/PresupuestoLimpio`;
    const url = `${urlApi}?intEmpresa=${empresaId}&intYear=${this.intYear}`;

    this.apiResponseS.onGetList(url).then((response: AspelBudgetDTO) => {
      if (response && response.cuentas && response.cuentas.length > 0) {
        this.budgetData = response;
        this.cuentasSignal.set(this.budgetData.cuentas);
      } else {
        this.handleError(
          (response as any)?.strMensaje ||
            "No se encontraron datos de cuentas detalladas o la respuesta no es válida.",
        );
        if (response && response.Nombre_Empresa) {
          this.budgetData = response;
        }
      }
    });
  }

  /**
   * Obtiene el monto de un mes específico para una cuenta.
   * @param cuenta Cuenta detallada
   * @param mes Nombre del mes en minúsculas
   * @returns Monto del mes o 0 si no existe
   */
  getMontoMes(cuenta: CuentaAspelDetalladaDTO, mes: string): number {
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const key = ("monto_" + mesCapitalizado) as keyof CuentaAspelDetalladaDTO;
    const value = cuenta[key];
    return typeof value === "number" ? value : 0;
  }

  /**
   * Obtiene el presupuesto del mes específico para una cuenta.
   * Usado por preFormMonth.
   * @param cuenta Cuenta detallada
   * @param mes Nombre del mes en minúsculas
   * @returns Presupuesto del mes o 0 si no existe
   */
  getPresupuestoDelMes(cuenta: CuentaAspelDetalladaDTO, mes: string): number {
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const key = ("presup_" + mesCapitalizado) as keyof CuentaAspelDetalladaDTO;
    const value = cuenta[key];
    return typeof value === "number" ? value : 0;
  }

  /**
   * Obtiene el presupuesto base mensual (último valor válido).
   * @param cuenta Cuenta detallada
   * @returns Presupuesto base mensual
   */
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
      if (typeof valor === "number" && !isNaN(valor)) {
        vigente = valor;
      }
    }
    return vigente;
  }

  /**
   * Obtiene el total del monto para un mes específico.
   * @param mes Nombre del mes en minúsculas
   * @returns Total del monto del mes
   */
  getTotalMontoPorMes(mes: string): number {
    if (!this.budgetData) return 0;
    const capitalizedMes =
      mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase();
    const key = ("total" + capitalizedMes + "Monto") as keyof AspelBudgetDTO;
    const value = this.budgetData[key];
    return typeof value === "number" ? value : 0;
  }

  //Sumas los totales depresupuestos mensuales, // Suma total del presupuesto base mensual de todas las cuentas no agrupadoras
  getTotalPresupuestoBaseMensual(): number {
    return this.cuentasSignal()
      .filter((c) => !c.esFilaAgrupadora)
      .map((c) => this.getPresupuestoBaseMensual(c))
      .reduce((a, b) => a + b, 0);
  }

  // Suma total del presupuesto de un mes específico de todas las cuentas no agrupadoras
  getTotalPresupuestoDelMes(mes: string): number {
    return this.cuentasSignal()
      .filter((c) => !c.esFilaAgrupadora)
      .map((c) => this.getPresupuestoDelMes(c, mes))
      .reduce((a, b) => a + b, 0);
  }

  // Devuelve 'mayor', 'menor' o 'igual' según la comparación
  gastoExcedido(mes: string): boolean {
    const monto = this.getTotalMontoPorMes(mes);
    const presupuesto = this.getTotalPresupuestoDelMes(mes);
    return monto > presupuesto;
  }

  //Porcentae de lo gastado...

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
    // Recorre los meses en orden y regresa el último mes con gasto > 0
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









