/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explícita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { MultiSelect } from "primeng/multiselect";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { Table, TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { Subscription } from "rxjs";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import {
  BudgetProposalDTO,
  BudgetProposalItemDTO,
} from "src/app/features/accounting/general-ledger/contabilidad/presupuesto-propuesta/models/budget-proposal.model";
import { EquiposList } from "src/app/features/maintenance/equipos-y-maquinaria/machinery/equipos-list";
import Swal from "sweetalert2";
import ProjectedExpensesList from "../../espejo-aspel/projected-expenses-list";
import { PurchaseHistory } from "../presupuesto-web-aspel/purchase-history";
import { AccountModalAdd } from "./account-modal-add";
import { BudgetAuditDialog } from "./budget-audit-dialog";
import { BudgetForecastDialog } from "./budget-forecast-dialog";
import { BudgetHistoryDialog } from "./budget-history-dialog";
import { BudgetSupportDialog } from "./budget-support-dialog";
import { FeeComparisonByFija } from "./fee-comparison-by-fija";
import { BudgetExecutionDetailsModal } from "./modal-budget-execution-details";
import { FeeComparisonByIndivisoModal } from "./modal-fee-comparison-by-indiviso";
import { ExcelExportService } from "./services/excel-export.service";
/**
 * Componente principal para la gestión de la propuesta de presupuesto.
 * Maneja la visualización, edición y colaboración en tiempo real de las partidas presupuestarias.
 * Utiliza Angular Signals para una gestión de estado reactiva y eficiente.
 */

@Component({
  selector: "app-presupuesto-propuesta",
  imports: [
    AppIcon,
    CommonModule,
    CustomSearchInput,
    FormsModule,
    CustomInputNumberSignal,
    MultiSelect,
    TableModule,
    CustomInputSelectSignal,
    DialogModule,
    CheckboxModule,
    TooltipModule,
  ],
  templateUrl: "./presupuesto-propuesta.html",
})
export class PresupuestoPropuesta implements OnDestroy, OnInit {
  private destroyRef = inject(DestroyRef);
  // --------------------------------------------------------------------------------
  // Inyección de Servicios
  // --------------------------------------------------------------------------------

  /** Servicio para realizar operaciones CRUD con el API. */
  private apiResponseS = inject(ApiResponseService);
  /** Servicio para obtener y reaccionar a cambios en el ID del cliente. */
  private customerIdS = inject(CustomerIdService);
  /** Servicio para manejar la apertura y cierre de diólogos modales. */
  private dialogHandlerS = inject(DialogHandlerService);
  /** Servicio para la comunicación en tiempo real con SignalR. */
  private signalRService = inject(SignalRService);
  /** Servicio para mostrar notificaciones (toasts) personalizadas. */
  private customToastService = inject(CustomToastService);
  /** Servicio para la gestión y verificación de roles de usuario. */
  public aspRoleS = inject(AspRoleService);
  /** Servicio especializado en la exportación de datos a formato Excel. */
  private excelExportService = inject(ExcelExportService);
  dt = viewChild<Table>("dt");

  // --------------------------------------------------------------------------------
  // Propiedades de Estado y Seóales (Signals)
  // --------------------------------------------------------------------------------

  /** Enum para referenciar los roles de usuario de forma segura. */
  aspRole = EApplicationRole;

  /** Signal que indica si una operación de carga de datos esté en curso. */
  loading = signal(false);
  /** Mensaje de error a mostrar en la UI si algo falla. */
  errorMensaje: string | null = null;
  /** Signal para controlar la visibilidad de la columna del presupuesto mensual base. */
  showBaseBudgetMonthlyColumn = signal(false);
  /** Signal para controlar la visibilidad de la columna del presupuesto anual base. */
  showBaseBudgetAnnualColumn = signal(false);
  /** Signal para controlar la visibilidad de la columna del presupuesto anual fiscal. */
  showFiscalYearAnnualColumn = signal(true);

  showProjectedExpenses = signal(true);
  /** Signal para controlar la visibilidad del modal de incrementos > 5% */
  showHighIncreaseModal = signal(false);

  /** ID del cliente actual. */
  customerId: string = this.customerIdS.customerId();
  /** Aóo fiscal para el cual se esté generando la propuesta (normalmente el próximo Aóo). */
  selectedFiscalYear: number = new Date().getFullYear();
  fiscalYear: number = this.selectedFiscalYear;
  /** Aóo fiscal que se usa como base para comparaciones (normalmente el Aóo actual). */
  baseBudgetYear: number = this.selectedFiscalYear - 1;
  /** Lista de aóos disponibles para la selección del Aóo fiscal. */
  availableYears: number[] = [];

  /** Campos utilizados por el filtro global de la tabla PrimeNG. */
  globalFilterFields: string[] = ["accountNumber", "accountName"];

  /** Signal que almacena el objeto principal de la propuesta de presupuesto. */
  currentProposal = signal<BudgetProposalDTO | null>(null);
  /** Signal que contiene la lista maestra y completa de todas las partidas de la propuesta, tal como se reciben del API. Sirve como la fuente de verdad. */
  allProposalItems = signal<BudgetProposalItemDTO[]>([]);
  /** Signal que contiene la lista de partidas que se muestra en la tabla, despuós de aplicar los filtros. Es un estado derivado de `allProposalItems`. */
  proposalItems = signal<BudgetProposalItemDTO[]>([]);
  /** Signal que almacena un Map de claves de items ejecutados a sus IDs de BudgetExecution para una bósqueda rápida. */
  projectedExpenseItems = signal<Map<string, string>>(new Map());
  /** Signal computada con las partidas cuyo incremento es > 5% */
  highIncreaseItems = computed(() =>
    this.allProposalItems().filter(
      (item) => !item.esFilaAgrupadora && item.percentageIncrease > 5,
    ),
  );
  /** Copia profunda de las partidas originales para comparar cambios y evitar llamadas innecesarias al API. */
  originalProposalItems: BudgetProposalItemDTO[] = [];

  // --------------------------------------------------------------------------------
  // Propiedades para Filtros y Paginación
  // --------------------------------------------------------------------------------

  /** Indica si existen partidas de tipo 'Extraordinarios' en la propuesta. */
  hasExtraordinarios: boolean = false;
  /** Controla la visibilidad de las partidas 'Extraordinarios'. */
  showExtraordinarios: boolean = false;
  /** Indica si existen partidas de tipo 'Proyectos' en la propuesta. */
  hasProyectos: boolean = false;
  /** Indica si existen partidas de tipo 'Proyectos' en la propuesta. */

  /** Controla la visibilidad de las partidas 'Proyectos'. */
  showProyectos: boolean = false;

  // ... (imports)

  // ... inside class PresupuestoPropuesta

  // Variables para Auditoría IA y Forecast Eliminadas (Manejadas por dialogs)
  inflationRate: number = 5;
  // ...

  async auditProposal() {
    if (this.proposalItems().length === 0) {
      this.customToastService.showWarn(
        "Sin datos",
        "No hay partidas visibles para auditar.",
      );
      return;
    }

    this.dialogHandlerS.openDialog(
      BudgetAuditDialog,
      { items: this.proposalItems() },
      "🤖 Reporte de Auditoría Presupuestal",
      this.dialogHandlerS.sizeMd, // Ajustar tamaóo segón preferencia
    );
  }

  forecastProposal() {
    if (this.proposalItems().length === 0) {
      this.customToastService.showWarn(
        "Sin datos",
        "No hay partidas visibles para proyectar.",
      );
      return;
    }

    this.dialogHandlerS
      .openDialog<any[]>(
        BudgetForecastDialog,
        {
          items: this.proposalItems(),
          inflationRate: this.inflationRate,
          selectedMonthsForAvg: this.selectedMonthsForAvg(),
        },
        `?? Proyección Financiera Inteligente ${this.selectedFiscalYear}`,
        this.dialogHandlerS.sizeFull,
      )
      .then((selectedItems: any[]) => {
        if (selectedItems && selectedItems.length > 0) {
          this.applyForecast(selectedItems);
        }
      });
  }

  applyForecast(selectedForecastItems: any[]) {
    let appliedCount = 0;
    selectedForecastItems.forEach((suggestion) => {
      const item = this.proposalItems().find(
        (p) => p.accountNumber.toString() === suggestion.accountNumber,
      );
      if (item) {
        item.proposedAmount = suggestion.suggestedAmount;
        // Trigger recalculation logic if needed (e.g. difference, percentage)
        this.onProposedAmountChange(item);
        appliedCount++;
      }
    });

    this.customToastService.showSuccess(
      "Proyección Aplicada",
      `Se actualizaron ${appliedCount} partidas.`,
    );
    this.recalculateTotals();
  }

  /**
   * Determina si una partida tiene un déficit presupuestal (Propuesta < Gasto Promedio).
   * @param item Partida a evaluar
   */
  isDeficit(item: BudgetProposalItemDTO): boolean {
    if (item.esFilaAgrupadora) return false;
    const avgExpense = this.getAverageMonthlyExpense(item);
    // Margen de tolerancia pequeóo (ej. $1) para evitar falsos positivos por redondeo
    return item.proposedAmount < avgExpense - 1;
  }

  /**
   * Determina si una partida tiene un incremento elevado (> 5%).
   * @param item Partida a evaluar
   */
  isHighIncrease(item: BudgetProposalItemDTO): boolean {
    if (item.esFilaAgrupadora) return false;
    if (item.currentAmount <= 0) return false;
    return item.percentageIncrease > 5;
  }

  /** Número de filas por página para la tabla. */
  tablePrimeNgRows: number = tablePrimeNgRows();
  /** Opciones de número de filas por página. */
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  /** Array para almacenar las suscripciones de RxJS y poder desuscribirse en ngOnDestroy. */
  private subscriptions: Subscription[] = [];

  // --------------------------------------------------------------------------------
  // Ciclo de Vida del Componente
  // --------------------------------------------------------------------------------

  // Propiedades computadas para los botones de visibilidad de columnas
  get baseBudgetMonthlyButtonIcon(): string {
    return this.showBaseBudgetMonthlyColumn()
      ? "mdi:eye-outline"
      : "mdi:eye-off-outline";
  }
  get baseBudgetMonthlyButtonLabel(): string {
    return this.showBaseBudgetMonthlyColumn()
      ? `Ocultar Mensual ${this.baseBudgetYear}`
      : `Mostrar Mensual ${this.baseBudgetYear}`;
  }

  get baseBudgetAnnualButtonIcon(): string {
    return this.showBaseBudgetAnnualColumn()
      ? "mdi:eye-outline"
      : "mdi:eye-off-outline";
  }
  get baseBudgetAnnualButtonLabel(): string {
    return this.showBaseBudgetAnnualColumn()
      ? `Ocultar Anual ${this.baseBudgetYear}`
      : `Mostrar Anual ${this.baseBudgetYear}`;
  }

  get fiscalYearAnnualButtonIcon(): string {
    return this.showFiscalYearAnnualColumn()
      ? "mdi:eye-outline"
      : "mdi:eye-off-outline";
  }
  get fiscalYearAnnualButtonLabel(): string {
    return this.showFiscalYearAnnualColumn()
      ? `Ocultar Anual ${this.fiscalYear}`
      : `Mostrar Anual ${this.fiscalYear}`;
  }

  get projectedExpensesButtonIcon(): string {
    return this.showProjectedExpenses()
      ? "mdi:eye-outline"
      : "mdi:eye-off-outline";
  }
  get projectedExpensesButtonLabel(): string {
    return this.showProjectedExpenses()
      ? "Ocultar Proyección Gastos"
      : "Mostrar Proyección Gastos";
  }

  constructor() {
    // `effect` de Angular Signals que se ejecuta automíticamente cuando `customerId` cambia.
    effect(() => {
      this.customerId = this.customerIdS.customerId();
      if (this.customerId) this.onLoadData();
    });
  }

  /**
   * Se ejecuta al inicializar el componente. Inicia la conexión SignalR y se suscribe a los eventos de actualización.
   */
  /**
   * Se ejecuta al inicializar el componente. Inicia la conexión SignalR y se suscribe a los eventos de actualización.
   */
  ngOnInit(): void {
    this.signalRService.start();
    this.initializeYears();

    this.signalRService.budgetProposalItemUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updatedItem: BudgetProposalItemDTO) => {
        this.handleBudgetProposalItemUpdate(updatedItem);
        this.customToastService.showInfo(
          "Cuenta actualizada!",
          `${updatedItem.accountName} | ${updatedItem.proposedAmount}`,
        );
      });

    this.signalRService.projectedExpenseUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload: any) => {
        this.handleProjectedExpenseUpdate(payload);
      });
  }

  /**
   * Se ejecuta al destruir el componente. Limpia las suscripciones y la conexión SignalR.
   */
  ngOnDestroy(): void {
    // this.subscriptions.forEach((sub) => sub.unsubscribe()); // Handled by takeUntilDestroyed
    this.signalRService.leaveProposalGroup(
      this.customerId,
      this.selectedFiscalYear,
    );
    this.signalRService.stop();
  }

  openHighIncreaseModal() {
    this.showHighIncreaseModal.set(true);
  }

  // --------------------------------------------------------------------------------
  // Carga de Datos y Manejo de Estado
  // --------------------------------------------------------------------------------

  /**
   * Carga los datos de la propuesta de presupuesto desde el API para el cliente y Aóo fiscal actuales.
   */
  onLoadData(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<BudgetProposalDTO>(
        `BudgetProposal?customerId=${this.customerId}&fiscalYear=${this.selectedFiscalYear}`,
      )
      .then((response) => {
        if (response && response.items) {
          this.currentProposal.set(response);
          this.allProposalItems.set(response.items || []);
          // Convertir la lista de ExecutedBudgetItemDTO a un Map para bósqueda rápida
          const executedMap = new Map<string, string>();
          (response.projectedExpenseItems || []).forEach((execItem) => {
            executedMap.set(execItem.key, execItem.budgetExecutionId);
          });
          this.projectedExpenseItems.set(executedMap);
          // Crea una copia profunda para detectar cambios posteriores.
          this.originalProposalItems = JSON.parse(
            JSON.stringify(response.items || []),
          );

          // Inicializa los flags para los filtros basados en los datos cargados.
          this.hasExtraordinarios = this.allProposalItems().some((p) =>
            p.accountNumber.startsWith("605-"),
          );
          this.hasProyectos = this.allProposalItems().some((p) =>
            p.accountNumber.startsWith("606-"),
          );
          this.showExtraordinarios = this.hasExtraordinarios;
          this.showProyectos = this.hasProyectos;

          this.applyFilters();
          this.autoSelectMonthsWithExpenses(this.allProposalItems());
          this.errorMensaje = null;

          // Se une al grupo de SignalR para recibir actualizaciones en tiempo real.
          this.signalRService.joinProposalGroup(
            this.customerId,
            this.selectedFiscalYear,
          );
        } else {
          // Maneja el caso donde no se encuentra una propuesta.
          this.currentProposal.set(null);
          this.allProposalItems.set([]);
          this.proposalItems.set([]);
          this.errorMensaje =
            "No se encontré una propuesta para el Aóo fiscal seleccionado.";
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje = "Error al cargar la propuesta.";
        this.loading.set(false);
      });
  }
  /**
   * Inicializa la lista de aóos disponibles para el selector, desde 2014 hasta el Aóo actual + 1.
   */
  initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = 2014; year <= currentYear + 1; year++) {
      this.availableYears.push(year);
    }
  }

  /**
   * Se ejecuta cuando el usuario cambia el Aóo fiscal en el selector.
   * Actualiza el Aóo fiscal seleccionado y vuelve a cargar los datos.
   */

  /**
   * Analiza todas las partidas para detectar hasta qué mes hay gastos reales (mayores a cero).
   */
  autoSelectMonthsWithExpenses(items: BudgetProposalItemDTO[]): void {
    if (!items || items.length === 0) return;

    const monthToExpensePropertyMap: {
      [key: string]: keyof BudgetProposalItemDTO;
    } = {
      enero: "gastoEnero",
      febrero: "gastoFebrero",
      marzo: "gastoMarzo",
      abril: "gastoAbril",
      mayo: "gastoMayo",
      junio: "gastoJunio",
      julio: "gastoJulio",
      agosto: "gastoAgosto",
      septiembre: "gastoSeptiembre",
      octubre: "gastoOctubre",
      noviembre: "gastoNoviembre",
      diciembre: "gastoDiciembre",
    };

    let lastMonthWithExpenseIndex = -1;

    for (let i = 0; i < this.months.length; i++) {
      const monthName = this.months[i];
      const expenseProperty = monthToExpensePropertyMap[monthName];

      const hasExpense = items.some(
        (item) =>
          !item.esFilaAgrupadora &&
          typeof item[expenseProperty] === "number" &&
          (item[expenseProperty] as number) > 0,
      );

      if (hasExpense) {
        lastMonthWithExpenseIndex = i;
      }
    }

    if (lastMonthWithExpenseIndex >= 0) {
      this.selectedMonthsForAvg.set(
        this.months.slice(0, lastMonthWithExpenseIndex + 1),
      );
    } else {
      this.selectedMonthsForAvg.set([...this.months]);
    }
  }

  onFiscalYearChange(): void {
    this.fiscalYear = this.selectedFiscalYear;
    this.baseBudgetYear = this.selectedFiscalYear - 1;
    this.onLoadData();
  }

  /**
   * Maneja la actualización de una partida recibida por SignalR.
   * Actualiza la lista maestra y la copia original, y luego reaplica los filtros y recalcula los totales.
   * @param updatedItem La partida actualizada recibida desde el servidor.
   */
  handleBudgetProposalItemUpdate(updatedItem: BudgetProposalItemDTO): void {
    this.allProposalItems.update((items) => {
      const index = items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        const newItems = [...items];
        newItems[index] = updatedItem;
        return newItems;
      }
      return items;
    });

    const originalIndex = this.originalProposalItems.findIndex(
      (item) => item.id === updatedItem.id,
    );
    if (originalIndex !== -1) {
      this.originalProposalItems[originalIndex] = updatedItem;
    }

    this.applyFilters();
    this.recalculateTotals();
  }

  private handleProjectedExpenseUpdate(payload: any): void {
    this.projectedExpenseItems.update((currentMap) => {
      const newMap = new Map(currentMap);
      if (payload.action === "add") {
        newMap.set(payload.key, payload.projectedExpenseId);
      } else if (payload.action === "remove") {
        newMap.delete(payload.key);
      }
      return newMap;
    });
  }

  // --------------------------------------------------------------------------------
  // Lígica de Filtros
  // --------------------------------------------------------------------------------

  /**
   * Filtra la lista maestra (`allProposalItems`) segón el estado de los toggles `showExtraordinarios` y `showProyectos`,
   * y actualiza la lista visible (`proposalItems`).
   */
  applyFilters(): void {
    let filteredData = [...this.allProposalItems()];

    if (!this.showExtraordinarios) {
      filteredData = filteredData.filter(
        (p) => !p.accountNumber.startsWith("605-"),
      );
    }

    if (!this.showProyectos) {
      filteredData = filteredData.filter(
        (p) => !p.accountNumber.startsWith("606-"),
      );
    }

    this.proposalItems.set(filteredData);
  }

  /** Alterna la visibilidad de las partidas de tipo 'Extraordinarios'. */
  toggleExtraordinarios(): void {
    this.showExtraordinarios = !this.showExtraordinarios;
    this.applyFilters();
  }

  /** Alterna la visibilidad de las partidas de tipo 'Proyectos'. */
  toggleProyectos(): void {
    this.showProyectos = !this.showProyectos;
    this.applyFilters();
  }

  /** Alterna la visibilidad de la columna de presupuesto mensual base. */
  toggleBaseBudgetMonthlyColumn(): void {
    this.showBaseBudgetMonthlyColumn.update((value) => !value);
    // this.recalculateTableLayout();
  }

  /** Alterna la visibilidad de la columna de presupuesto anual base. */
  toggleBaseBudgetAnnualColumn(): void {
    this.showBaseBudgetAnnualColumn.update((value) => !value);
    // this.recalculateTableLayout();
  }

  /** Alterna la visibilidad de la columna de presupuesto anual fiscal. */
  toggleFiscalYearAnnualColumn(): void {
    this.showFiscalYearAnnualColumn.update((value) => !value);
    // this.recalculateTableLayout();
  }
  toggleshowProjectedExpenses(): void {
    this.showProjectedExpenses.update((value) => !value);
  }

  /**
   * Fuerza una recalculación del layout de la tabla.
   * Se usa un setTimeout para asegurar que se ejecute despuós de que Angular actualice el DOM.
   * Se utiliza updateSize() ya que recalculateLayout() no existe en la API póblica de p-table.
   */
  private recalculateTableLayout(): void {
    setTimeout(() => {
      const dt = this.dt();
      if (dt) {
        (dt as any).initColumns();
      }
    }, 0);
  }

  /**
   * Calcula dinámicamente el `colspan` para el encabezado 'PRESUPUESTO ACTUAL'.
   * El valor cambia segón las columnas de presupuesto base que estén visibles.
   * @returns El número de columnas que debe abarcar el encabezado.
   */
  /**
   * Calcula dinámicamente los valores de colspan para los encabezados y filas de agrupación.
   * Centraliza la lígica para asegurar la sincronización de la tabla.
   * @returns Un objeto con los colspans para 'presupuestoActual', 'propuesta' y 'total'.
   */
  get colspans() {
    const baseMonthly = this.showBaseBudgetMonthlyColumn();
    const baseAnnual = this.showBaseBudgetAnnualColumn();
    const fiscalAnnual = this.showFiscalYearAnnualColumn();

    // Colspan para el grupo "PRESUPUESTO ACTUAL"
    // Base: Cuenta (1) + Meses (12) + Promedio (1) = 14
    const presupuestoActual = 14 + (baseMonthly ? 1 : 0) + (baseAnnual ? 1 : 0);

    // Colspan para el grupo "PROPUESTA"
    // Base: Propuesta Mensual (1) + Dif (1) + % (1) = 3
    const propuesta = 3 + (fiscalAnnual ? 1 : 0);

    // Total de columnas para las filas de agrupación
    const total = presupuestoActual + propuesta;

    return {
      presupuestoActual,
      propuesta,
      total,
    };
  }

  // --------------------------------------------------------------------------------
  // Métodos de Cólculo
  // --------------------------------------------------------------------------------

  /**
   * Recalcula el monto total de la propuesta sumando los `proposedAmount` de las partidas visibles.
   */
  recalculateTotals(): void {
    const newTotal = this.proposalItems().reduce((sum, i) => {
      return sum + (i.esFilaAgrupadora ? 0 : Number(i.proposedAmount) || 0);
    }, 0);

    this.currentProposal.update((p) => {
      if (p) {
        return { ...p, totalAmount: newTotal };
      }
      return p;
    });
  }

  /**
   * Calcula el gasto promedio mensual para una partida.
   * Puede promediar sobre todos los meses o sobre una selección personalizada del usuario.
   * @param item La partida para la cual se calcularé el promedio.
   * @returns El gasto promedio mensual.
   */
  getAverageMonthlyExpense(item: BudgetProposalItemDTO): number {
    if (!item || item.esFilaAgrupadora) {
      return 0;
    }

    const monthToExpensePropertyMap: {
      [key: string]: keyof BudgetProposalItemDTO;
    } = {
      enero: "gastoEnero",
      febrero: "gastoFebrero",
      marzo: "gastoMarzo",
      abril: "gastoAbril",
      mayo: "gastoMayo",
      junio: "gastoJunio",
      julio: "gastoJulio",
      agosto: "gastoAgosto",
      septiembre: "gastoSeptiembre",
      octubre: "gastoOctubre",
      noviembre: "gastoNoviembre",
      diciembre: "gastoDiciembre",
    };

    let expensesToAverage: number[] = [];

    if (this.selectedMonthsForAvg() && this.selectedMonthsForAvg().length > 0) {
      for (const monthName of this.selectedMonthsForAvg()) {
        const expenseProperty = monthToExpensePropertyMap[monthName];
        if (expenseProperty && typeof item[expenseProperty] === "number") {
          expensesToAverage.push(item[expenseProperty] as number);
        }
      }
    } else {
      // Si no hay meses seleccionados, se promedian todos los meses con gastos.
      expensesToAverage = [
        item.gastoEnero,
        item.gastoFebrero,
        item.gastoMarzo,
        item.gastoAbril,
        item.gastoMayo,
        item.gastoJunio,
        item.gastoJulio,
        item.gastoAgosto,
        item.gastoSeptiembre,
        item.gastoOctubre,
        item.gastoNoviembre,
        item.gastoDiciembre,
      ].filter((expense) => typeof expense === "number") as number[];
    }

    if (expensesToAverage.length === 0) {
      return 0;
    }

    const totalExpense = expensesToAverage.reduce(
      (sum, expense) => sum + (expense || 0),
      0,
    );
    return totalExpense / expensesToAverage.length;
  }

  /**
   * Calcula el presupuesto promedio mensual para una partida.
   * Similar a `getAverageMonthlyExpense`, pero para los montos presupuestados.
   * @param item La partida para la cual se calcularé el promedio.
   * @returns El presupuesto promedio mensual.
   */
  getAverageMonthlyBudget(item: BudgetProposalItemDTO): number {
    if (!item || item.esFilaAgrupadora) {
      return 0;
    }

    const monthToBudgetPropertyMap: {
      [key: string]: keyof BudgetProposalItemDTO;
    } = {
      enero: "presupuestoEnero",
      febrero: "presupuestoFebrero",
      marzo: "presupuestoMarzo",
      abril: "presupuestoAbril",
      mayo: "presupuestoMayo",
      junio: "presupuestoJunio",
      julio: "presupuestoJulio",
      agosto: "presupuestoAgosto",
      septiembre: "presupuestoSeptiembre",
      octubre: "presupuestoOctubre",
      noviembre: "presupuestoNoviembre",
      diciembre: "presupuestoDiciembre",
    };

    let budgetsToAverage: number[] = [];

    if (this.selectedMonthsForAvg() && this.selectedMonthsForAvg().length > 0) {
      for (const monthName of this.selectedMonthsForAvg()) {
        const budgetProperty = monthToBudgetPropertyMap[monthName];
        if (budgetProperty && typeof item[budgetProperty] === "number") {
          budgetsToAverage.push(item[budgetProperty] as number);
        }
      }
    } else {
      budgetsToAverage = [
        item.presupuestoEnero,
        item.presupuestoFebrero,
        item.presupuestoMarzo,
        item.presupuestoAbril,
        item.presupuestoMayo,
        item.presupuestoJunio,
        item.presupuestoJulio,
        item.presupuestoAgosto,
        item.presupuestoSeptiembre,
        item.presupuestoOctubre,
        item.presupuestoNoviembre,
        item.presupuestoDiciembre,
      ].filter((budget) => typeof budget === "number") as number[];
    }

    if (budgetsToAverage.length === 0) {
      return 0;
    }

    const totalBudget = budgetsToAverage.reduce(
      (sum, budget) => sum + (budget || 0),
      0,
    );
    return totalBudget / budgetsToAverage.length;
  }

  /**
   * Se dispara cuando el usuario modifica el campo de monto propuesto.
   * Recalcula la diferencia y el porcentaje de cambio en tiempo real para esa fila.
   * @param item La partida que esté siendo modificada.
   */
  onProposedAmountChange(item: BudgetProposalItemDTO): void {
    const proposedAmount = Number(
      String(item.proposedAmount).replace(/,/g, ""),
    );

    item.difference = proposedAmount - item.currentAmount;

    if (item.currentAmount === 0) {
      item.percentageIncrease = proposedAmount > 0 ? 100 : 0;
    } else {
      item.percentageIncrease =
        ((proposedAmount - item.currentAmount) / item.currentAmount) * 100;
    }

    this.recalculateTotals();
  }

  /**
   * Calcula el total de la columna 'Promedio Mensual Gastado'.
   * @returns La suma de todos los promedios mensuales.
   */
  getTotalAverageMonthlyExpense(): number {
    if (!this.proposalItems()) return 0;
    return this.proposalItems().reduce((sum, item) => {
      return sum + this.getAverageMonthlyExpense(item);
    }, 0);
  }

  /**
   * Calcula el total de la columna 'Promedio Mensual Presupuestado'.
   * @returns La suma de todos los promedios mensuales de presupuesto.
   */
  getTotalAverageMonthlyBudget(): number {
    if (!this.proposalItems()) return 0;
    return this.proposalItems().reduce((sum, item) => {
      return sum + this.getAverageMonthlyBudget(item);
    }, 0);
  }

  /**
   * Guarda los cambios de una partida en el backend.
   * Optimización: solo envía la petición si el valor realmente ha cambiado.
   * @param item La partida a actualizar.
   */
  updateProposalItem(item: BudgetProposalItemDTO): void {
    const originalItem = this.originalProposalItems.find(
      (i) => i.id === item.id,
    );
    const currentProposedAmount = Number(
      String(item.proposedAmount).replace(/,/g, ""),
    );

    // Evita llamadas al API si el valor no ha cambiado.
    if (originalItem && originalItem.proposedAmount === currentProposedAmount) {
      return;
    }

    this.loading.set(true);
    const updateDTO = {
      proposedAmount: currentProposedAmount,
      excludedConnectionId: this.signalRService.connectionId(),
    };
    this.apiResponseS
      .onPut<BudgetProposalItemDTO>(
        `BudgetProposal/${item.id}`,
        updateDTO,
        false,
        false,
      )
      .then((response) => {
        if (response) {
          // Actualiza la UI con la respuesta del servidor.
          this.proposalItems.update((items) => {
            const index = items.findIndex((i) => i.id === item.id);
            if (index !== -1) {
              const newItems = [...items];
              newItems[index].proposedAmount = response.proposedAmount;
              newItems[index].difference = response.difference;
              newItems[index].percentageIncrease = response.percentageIncrease;
              return newItems;
            }
            return items;
          });

          // Actualiza la copia original con el nuevo estado guardado.
          const originalIndex = this.originalProposalItems.findIndex(
            (i) => i.id === response.id,
          );
          if (originalIndex !== -1) {
            this.originalProposalItems[originalIndex] = JSON.parse(
              JSON.stringify(response),
            );
          }

          this.errorMensaje = null;
          this.recalculateTotals();
        }
      })
      .finally(() => this.loading.set(false));
  }

  // --------------------------------------------------------------------------------
  // Métodos de Interacción y Diólogos
  // --------------------------------------------------------------------------------

  /**
   * Muestra un diólogo con el historial de compras de una cuenta.
   * @param item La partida seleccionada.
   */
  showPurchaseHistory(item: BudgetProposalItemDTO) {
    this.dialogHandlerS.openDialog(
      PurchaseHistory,
      {
        fiscalYear: this.baseBudgetYear,
        accountNumber: item.accountNumber,
      },
      `HISTORIAL DE COMPRAS DE ${item.accountName}`,
      this.dialogHandlerS.sizeFull,
    );
  }

  /**
   * Calcula el porcentaje de cambio total de la propuesta.
   * @returns Una cadena de texto con el porcentaje formateado.
   */
  // getTotalPercentageChange(): string {
  //   const currentTotal = this.getSumaTotalPresupuestoActual();
  //   const proposeDTOtal = this.currentProposal()?.totalAmount;

  //   if (currentTotal === null || proposeDTOtal === null || currentTotal === 0) {
  //     return proposeDTOtal > 0 ? "+100%" : "0%";
  //   }

  //   const change = ((proposeDTOtal - currentTotal) / currentTotal) * 100;
  //   return `${change > 0 ? "+" : ""}${change.toFixed(0)}%`;
  // }
  getTotalPercentageChange(): number {
    const currentTotal = this.getSumaTotalPresupuestoActual();
    const proposeDTOtal = this.currentProposal()?.totalAmount;

    if (currentTotal === null || proposeDTOtal === null || currentTotal === 0) {
      return proposeDTOtal > 0 ? 100 : 0;
    }

    const change = ((proposeDTOtal - currentTotal) / currentTotal) * 100;
    return Math.round(change); // O change si prefieres sin redondear
  }

  // --------------------------------------------------------------------------------
  // Métodos y Propiedades para el Footer y Cólculos de Totales
  // --------------------------------------------------------------------------------

  /** Definición estructurada de columnas de meses para O(1) en HTML */
  readonly monthColumns = [
    {
      name: "enero",
      charIndex: 1,
      gastoKey: "gastoEnero",
      pptKey: "presupuestoEnero",
    },
    {
      name: "febrero",
      charIndex: 2,
      gastoKey: "gastoFebrero",
      pptKey: "presupuestoFebrero",
    },
    {
      name: "marzo",
      charIndex: 3,
      gastoKey: "gastoMarzo",
      pptKey: "presupuestoMarzo",
    },
    {
      name: "abril",
      charIndex: 4,
      gastoKey: "gastoAbril",
      pptKey: "presupuestoAbril",
    },
    {
      name: "mayo",
      charIndex: 5,
      gastoKey: "gastoMayo",
      pptKey: "presupuestoMayo",
    },
    {
      name: "junio",
      charIndex: 6,
      gastoKey: "gastoJunio",
      pptKey: "presupuestoJunio",
    },
    {
      name: "julio",
      charIndex: 7,
      gastoKey: "gastoJulio",
      pptKey: "presupuestoJulio",
    },
    {
      name: "agosto",
      charIndex: 8,
      gastoKey: "gastoAgosto",
      pptKey: "presupuestoAgosto",
    },
    {
      name: "septiembre",
      charIndex: 9,
      gastoKey: "gastoSeptiembre",
      pptKey: "presupuestoSeptiembre",
    },
    {
      name: "octubre",
      charIndex: 10,
      gastoKey: "gastoOctubre",
      pptKey: "presupuestoOctubre",
    },
    {
      name: "noviembre",
      charIndex: 11,
      gastoKey: "gastoNoviembre",
      pptKey: "presupuestoNoviembre",
    },
    {
      name: "diciembre",
      charIndex: 12,
      gastoKey: "gastoDiciembre",
      pptKey: "presupuestoDiciembre",
    },
  ] as const;

  /** Lista de meses para iterar en la plantilla (mantenido para reportes y utilidades) */
  readonly months: string[] = this.monthColumns.map((m) => m.name);

  /** Opciones para el selector de meses para el cólculo de promedios. */
  monthOptions = this.months.map((m) => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    value: m,
  }));

  /** Signal que almacena los meses seleccionados para calcular el promedio. */
  selectedMonthsForAvg = signal<string[]>([...this.months]);

  /**
   * Calcula el gasto total para un mes específico.
   * @param mes El nombre del mes.
   * @returns El gasto total de ese mes.
   */
  getTotalGastoPorMes(mes: string): number {
    if (!this.proposalItems()) return 0;
    const key =
      `gasto${mes.charAt(0).toUpperCase() + mes.slice(1)}` as keyof BudgetProposalItemDTO;
    return this.proposalItems().reduce(
      (sum, item) => sum + (item.esFilaAgrupadora ? 0 : Number(item[key]) || 0),
      0,
    );
  }

  /**
   * Calcula el presupuesto total para un mes específico.
   * @param mes El nombre del mes.
   * @returns El presupuesto total de ese mes.
   */
  getTotalPresupuestoPorMes(mes: string): number {
    if (!this.proposalItems()) return 0;
    const key = `presupuesto${
      mes.charAt(0).toUpperCase() + mes.slice(1)
    }` as keyof BudgetProposalItemDTO;
    return this.proposalItems().reduce(
      (sum, item) => sum + (item.esFilaAgrupadora ? 0 : Number(item[key]) || 0),
      0,
    );
  }

  /** @returns La suma de todos los gastos mensuales. */
  getSumaTotalGastos(): number {
    return this.months.reduce(
      (sum, mes) => sum + this.getTotalGastoPorMes(mes),
      0,
    );
  }

  /** @returns La suma de todos los presupuestos mensuales. */
  getSumaTotalPresupuestos(): number {
    return this.months.reduce(
      (sum, mes) => sum + this.getTotalPresupuestoPorMes(mes),
      0,
    );
  }

  /** @returns El porcentaje del presupuesto que se ha gastado. */
  getPorcentajeTotalGastado(): number {
    const totalPresupuesto = this.getSumaTotalPresupuestos();
    if (totalPresupuesto === 0) return 0;
    const totalGasto = this.getSumaTotalGastos();
    return (totalGasto / totalPresupuesto) * 100;
  }

  /** @returns El monto total del presupuesto que aón no se ha gastado. */
  getPresupuestoTotalRestante(): number {
    return this.getSumaTotalPresupuestos() - this.getSumaTotalGastos();
  }

  /** @returns La suma total del presupuesto actual, basado en la propiedad `currentAmount`. */
  getSumaTotalPresupuestoActual(): number {
    if (!this.proposalItems()) return 0;
    return this.proposalItems().reduce(
      (sum, item) =>
        sum + (item.esFilaAgrupadora ? 0 : item.currentAmount || 0),
      0,
    );
  }

  // --------------------------------------------------------------------------------
  // Métodos de Ayuda para la Plantilla (Template Helpers)
  // --------------------------------------------------------------------------------

  /**
   * Verifica si una combinación de partida y mes ha sido ejecutada.
   * @param item La partida de presupuesto.
   * @param mes El nombre del mes en minísculas.
   * @returns `true` si la partida ha sido ejecutada para ese mes.
   */
  isProjected(item: BudgetProposalItemDTO, mes: string): boolean {
    if (item.esFilaAgrupadora) return false;

    const monthMap: { [key: string]: number } = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
    };
    const monthNumber = monthMap[mes.toLowerCase()];
    if (!monthNumber) return false;

    const key = `${item.accountNumber}-${monthNumber}`;
    return this.projectedExpenseItems().has(key);
  }

  /**
   * Obtiene el ID de la BudgetExecution asociada a una partida y mes.
   * @param item La partida de presupuesto.
   * @param mes El nombre del mes en minísculas.
   * @returns El ID de la BudgetExecution o `undefined` si no se encuentra.
   */
  getProjectedExpenseId(
    item: BudgetProposalItemDTO,
    mes: string,
  ): string | undefined {
    if (item.esFilaAgrupadora) return undefined;

    const monthMap: { [key: string]: number } = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
    };
    const monthNumber = monthMap[mes.toLowerCase()];
    if (!monthNumber) return undefined;

    const key = `${item.accountNumber}-${monthNumber}`;
    return this.projectedExpenseItems().get(key);
  }

  /**
   * Obtiene el gasto de un mes específico para una partida.
   * @param item La partida.
   * @param mes El nombre del mes.
   * @returns El monto del gasto.
   */
  getGastoDelMes(item: BudgetProposalItemDTO, mes: string): number {
    const key =
      `gasto${mes.charAt(0).toUpperCase() + mes.slice(1)}` as keyof BudgetProposalItemDTO;
    return typeof item[key] === "number" ? (item[key] as number) : 0;
  }

  /**
   * Obtiene el presupuesto de un mes específico para una partida.
   * @param item La partida.
   * @param mes El nombre del mes.
   * @returns El monto del presupuesto.
   */
  getPresupuestoDelMes(item: BudgetProposalItemDTO, mes: string): number {
    const key = `presupuesto${
      mes.charAt(0).toUpperCase() + mes.slice(1)
    }` as keyof BudgetProposalItemDTO;
    return typeof item[key] === "number" ? (item[key] as number) : 0;
  }

  /**
   * Verifica si el gasto total de un mes ha excedido su presupuesto.
   * @param mes El nombre del mes.
   * @returns `true` si el gasto es mayor al presupuesto, `false` en caso contrario.
   */
  gastoDelMesExcedido(mes: string): boolean {
    const gasto = this.getTotalGastoPorMes(mes);
    const presupuesto = this.getTotalPresupuestoPorMes(mes);
    return presupuesto > 0 && gasto > presupuesto;
  }

  /**
   * Muestra un diólogo con el historial de cambios de una partida.
   * @param item La partida seleccionada.
   */
  showItemHistory(item: BudgetProposalItemDTO): void {
    this.dialogHandlerS.openDialog(
      BudgetHistoryDialog,
      {
        itemId: item.id,
        accountName: item.accountName,
      },
      `Historial de cambios de ${item.accountName}`,
      this.dialogHandlerS.sizeLg,
    );
  }

  /**
   * Muestra un diólogo para ver o adjuntar archivos de soporte a una partida.
   * @param item La partida seleccionada.
   */
  showSupportDialog(item: BudgetProposalItemDTO): void {
    this.dialogHandlerS.openDialog(
      BudgetSupportDialog,
      {
        budgetProposalItemId: item.id,
        accountName: item.accountName,
      },
      `Soportes de ${item.accountName}`,
      this.dialogHandlerS.sizeLg,
    );
  }

  /**
   * Muestra el diólogo modal para Aóadir nuevas cuentas a la propuesta.
   */
  showAddAccountModal(): void {
    const currentProposal = this.currentProposal();
    if (!currentProposal) return;

    this.dialogHandlerS
      .openDialog<string[]>(
        AccountModalAdd,
        {
          customerId: currentProposal.customerId,
          fiscalYear: currentProposal.fiscalYear,
          proposalId: currentProposal.id,
        },
        "Aóadir Cuentas",
        this.dialogHandlerS.sizeLg,
      )
      .then((selectedAccountNumbers: string[]) => {
        if (selectedAccountNumbers && selectedAccountNumbers.length > 0) {
          this.onAccountsSelected(selectedAccountNumbers);
        }
      });
  }

  /**
   * Muestra un modal con los detalles de una ejecución presupuestaria específica.
   * @param budgetExecutionId El ID de la ejecución presupuestaria a mostrar.
   */
  showBudgetExecutionDetails(month: string, accountNumber: string): void {
    this.dialogHandlerS.openDialog(
      BudgetExecutionDetailsModal,
      { month: month, accountNumber: accountNumber },
      "Detalles de Ejecución Presupuestaria",
      this.dialogHandlerS.sizeLg,
    );
  }

  /**
   * Se ejecuta cuando el usuario selecciona cuentas en el modal `AddAccountModal`.
   * Envía las nuevas cuentas al backend para ser aóadidas a la propuesta.
   * @param accountNumbers Array de números de cuenta a Aóadir.
   */
  onAccountsSelected(accountNumbers: string[]): void {
    const currentProposal = this.currentProposal();
    if (!currentProposal) return;

    this.loading.set(true);
    this.apiResponseS
      .onPost<BudgetProposalItemDTO[]>(
        `BudgetProposal/${currentProposal.id}/add-accounts`,
        accountNumbers,
      )
      .then((response) => {
        if (response) {
          this.onLoadData(); // Recarga toda la propuesta para reflejar los cambios.
          this.errorMensaje = null;
        }
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  /**
   * Determina si una partida puede ser eliminada.
   * La regla es que solo se puede eliminar si no ha tenido actividad (gastos o presupuesto) en todo el Aóo base.
   * @param item La partida a verificar.
   * @returns `true` si el ótem puede ser eliminado.
   */
  canDeleteItem(item: BudgetProposalItemDTO): boolean {
    const hasNoActivity = this.months.every(
      (mes) =>
        this.getGastoDelMes(item, mes) === 0 &&
        this.getPresupuestoDelMes(item, mes) === 0,
    );

    return hasNoActivity;
  }

  /**
   * Elimina una partida de la propuesta, previa confirmación del usuario.
   * @param item La partida a eliminar.
   */
  deleteItem(item: BudgetProposalItemDTO): void {
    Swal.fire({
      title: "Confirmar",
      text: "óEsté seguro de eliminar esta cuenta?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.apiResponseS
          .onDelete(`BudgetProposal/item/${item.id}`)
          .then((success) => {
            if (success) {
              // Actualiza el estado local para remover el ótem sin recargar toda la data.
              this.allProposalItems.update((items) =>
                items.filter((i) => i.id !== item.id),
              );
              this.applyFilters();

              this.currentProposal.update((p) => {
                if (p) {
                  p.totalAmount -= item.proposedAmount;
                }
                return p;
              });

              Swal.fire({
                title: "Eliminado",
                text: "El item ha sido eliminado correctamente",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          })
          .finally(() => this.loading.set(false));
      }
    });
  }

  /**
   * Muestra el diólogo para comparar las cuotas de mantenimiento resultantes de la propuesta.
   */
  showFeeComparisonModal(): void {
    const proposal = this.currentProposal();
    if (!proposal) return;

    this.dialogHandlerS.openDialog(
      FeeComparisonByFija,
      {
        proposalId: proposal.id,
      },
      "CUOTAS DE MANTENIMIENTO FIJA",
      this.dialogHandlerS.sizeLg,
    );
  }

  /**
   * Muestra el diólogo modal para comparar las cuotas de mantenimiento resultantes de la propuesta, calculadas por indiviso.
   */
  showFeeComparisonByIndivisoModal(): void {
    const proposal = this.currentProposal();
    if (!proposal) return;

    this.dialogHandlerS.openDialog(
      FeeComparisonByIndivisoModal,
      {
        proposalId: proposal.id,
      },
      "COMPARACIóN DE CUOTAS DE MANTENIMIENTO (POR INDIVISO)",
      this.dialogHandlerS.sizeLg,
    );
  }

  // --------------------------------------------------------------------------------
  // Exportación a Excel
  // --------------------------------------------------------------------------------

  /**
   * Prepara los datos y llama al servicio de exportación a Excel.
   */
  exportarResumenExcel(): void {
    const meses = this.months;
    const filasATransportar = this.proposalItems();
    const totales = this.getTotalesParaExcel();

    this.excelExportService.exportResumenPresupuesto(
      filasATransportar,
      totales,
      meses,
      this.fiscalYear,
    );
  }

  /**
   * Prepara un objeto con los datos de totales para la fila de resumen en el Excel.
   * @returns Un objeto con los totales calculados.
   */
  private getTotalesParaExcel(): any {
    const meses = this.months;
    const totales: any = {};

    totales.accountName = "TOTALES";
    meses.forEach((mes) => {
      totales["gasto" + mes.charAt(0).toUpperCase() + mes.slice(1)] =
        this.getTotalGastoPorMes(mes);
    });

    totales.promedioGasto = this.getTotalAverageMonthlyExpense();
    totales.pstoMensual = this.getSumaTotalPresupuestos() / 12;
    totales.porcentajeCambio = this.getPorcentajeTotalGastado();

    return totales;
  }

  showProjectedExpensesModal() {
    this.dialogHandlerS
      .openDialog(ProjectedExpensesList, {}, "", this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  showMaintenanceCalendarModal() {
    this.dialogHandlerS
      .openDialog(EquiposList, {}, "", this.dialogHandlerS.sizeLg, true)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
