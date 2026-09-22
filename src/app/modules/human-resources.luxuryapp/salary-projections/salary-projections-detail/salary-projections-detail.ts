import { DatePipe, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DialogSize,
} from "@core/services/dialog-handler.service";
import { WorkPositionHours } from "@operations.luxuryapp/work-positions/work-position-hours";
import { CardEmployee } from "@recruitment.luxuryapp/employee-file/employees/employee-registry/card-employee";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppTable } from "@ui/web/table/table";
import { Subject, debounceTime } from "rxjs";
import {
  ISalaryProjection,
  ISalaryProjectionItem,
  ISalaryProjectionItemSimulation,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";

const LIST_URL = "/hr/salary-projections";

@Component({
  selector: "app-salary-projections-detail",
  templateUrl: "./salary-projections-detail.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    TableEmptyMessage,
    LxTag,
    WebButtonLabel,
    WebButtonIcon,
    FormsModule,
    DatePipe,
    DecimalPipe,
  ],
})
export class SalaryProjectionsDetail {
  private readonly api = inject(ApiResponseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  /** ♻️ Cola de simulación con debounce para no saturar el backend. */
  private readonly simulateQueue = new Subject<void>();
  /** 💾 Cola de auto-guardado con debounce. */
  private readonly autoSaveQueue = new Subject<void>();

  readonly projection = signal<ISalaryProjection | null>(null);
  readonly simulations = signal<
    Record<string, ISalaryProjectionItemSimulation>
  >({});

  readonly loading = signal(true);
  readonly simulating = signal(false);
  readonly saving = signal(false);

  readonly activeScenarioId = signal<string | null>(null);

  readonly stateText = salaryProjectionStateText;
  readonly stateSeverity = salaryProjectionStateSeverity;

  readonly scenarios = computed(() => this.projection()?.scenarios ?? []);

  readonly activeScenario = computed(() =>
    this.projection()?.scenarios.find((s) => s.id === this.activeScenarioId()),
  );

  readonly activeItems = computed(() => this.activeScenario()?.items ?? []);

  /** Determina si el escenario activo se puede editar.
   * Reglas:
   * 1. La propuesta debe estar en Borrador (0).
   * 2. El escenario activo NO debe ser el escenario base (índice 0).
   */
  readonly isEditable = computed(() => {
    const proj = this.projection();
    const activeId = this.activeScenarioId();
    if (!proj || !activeId) return false;

    // Solo editable en Borrador (0)
    if (proj.state !== 0) return false;

    // El escenario base (el primero) es de solo lectura
    const baseId = proj.scenarios[0]?.id;
    return activeId !== baseId;
  });

  readonly tableRows = computed<ISalaryProjectionItem[]>(() => {
    return [...this.activeItems()].sort((a, b) => {
      const depA = a.departament ?? 999;
      const depB = b.departament ?? 999;
      if (depA !== depB) {
        return depA - depB;
      }
      const orderA = a.sortOrder ?? 999;
      const orderB = b.sortOrder ?? 999;
      return orderA - orderB;
    });
  });

  readonly scenarioTotals = computed<
    Record<
      string,
      ISalaryProjectionItemSimulation & {
        netMonthlySalary: number;
        rcvEmployerFee: number;
        infonavitEmployerFee: number;
        imssEmployerFee: number;
      }
    >
  >(() => {
    const scenarios = this.scenarios();
    const sims = this.simulations();
    const totals: Record<string, any> = {};

    for (const scenario of scenarios) {
      let netMonthlySalary = 0;
      let vacationPremium = 0;
      let holidayPremium = 0;
      let sundayPremium = 0;
      let christmasBonus = 0;
      let monthlyPerceptions = 0;
      let rcvEmployerFee = 0;
      let infonavitEmployerFee = 0;
      let imssEmployerFee = 0;
      let employerPayrollTax = 0;
      let totalEmployerCost = 0;

      for (const item of scenario.items) {
        netMonthlySalary += item.netMonthlySalary || 0;

        const sim = sims[item.id];
        if (sim) {
          vacationPremium += sim.vacationPremium || 0;
          holidayPremium += sim.holidayPremium || 0;
          sundayPremium += sim.sundayPremium || 0;
          christmasBonus += sim.christmasBonus || 0;
          monthlyPerceptions += sim.monthlyPerceptions || 0;
          employerPayrollTax += sim.employerPayrollTax || 0;
          rcvEmployerFee += sim.rcvEmployerFee || 0;
          infonavitEmployerFee += sim.infonavitEmployerFee || 0;
          imssEmployerFee += sim.imssEmployerFee || 0;
          totalEmployerCost += sim.totalEmployerCost || 0;
        }
      }

      totals[scenario.id] = {
        netMonthlySalary,
        vacationPremium,
        holidayPremium,
        sundayPremium,
        christmasBonus,
        monthlyPerceptions,
        rcvEmployerFee,
        infonavitEmployerFee,
        imssEmployerFee,
        employerPayrollTax,
        totalEmployerCost,
      };
    }

    return totals;
  });

  readonly activeTotalCost = computed(() => {
    const simulations = this.simulations();
    return this.activeItems().reduce(
      (total, item) => total + (simulations[item.id]?.totalEmployerCost ?? 0),
      0,
    );
  });

  constructor() {
    this.simulateQueue
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe(() => void this.runSimulation());

    this.autoSaveQueue
      .pipe(debounceTime(800), takeUntilDestroyed())
      .subscribe(() => void this.persistProjection());

    void this.load();
  }

  async load(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      return;
    }

    this.loading.set(true);
    try {
      const data = await this.api.onGetItem<ISalaryProjection>(
        Endpoints.SalaryProjections.byId(id),
      );
      if (data) {
        this.projection.set(data);
        const currentScenarioId = this.activeScenarioId();
        if (
          !currentScenarioId ||
          !data.scenarios.some((s) => s.id === currentScenarioId)
        ) {
          this.activeScenarioId.set(
            data.scenarios[0].id || data.scenarios[0].id,
          );
        }
        this.queueSimulation();
      }
    } finally {
      this.loading.set(false);
    }
  }

  simulationOf(itemId: string): ISalaryProjectionItemSimulation | null {
    return this.simulations()[itemId] ?? null;
  }

  selectScenario(scenarioId: string): void {
    this.activeScenarioId.set(scenarioId);
  }

  back(): void {
    void this.router.navigate([LIST_URL]);
  }

  queueSimulation(): void {
    this.simulateQueue.next();
  }

  queueAutoSave(): void {
    if (!this.isEditable()) {
      return;
    }
    this.autoSaveQueue.next();
  }

  private buildScenariosPayload(projection: ISalaryProjection) {
    return projection.scenarios.map((scenario) => ({
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      items: scenario.items.map((item) => ({
        id: item.id,
        workPositionId: item.workPositionId,
        employeeId: item.employeeId,
        isNewPosition: item.isNewPosition,
        positionTitle: item.positionTitle,
        netMonthlySalary: Number(item.netMonthlySalary) || 0,
        applicationRoleId: item.applicationRoleId,
        weeklyHours: item.weeklyHours,
        dateAdmission: item.dateAdmission,
        rcvEmployerFee: Number(item.rcvEmployerFee) || 0,
        infonavitEmployerFee: Number(item.infonavitEmployerFee) || 0,
        imssEmployerFee: Number(item.imssEmployerFee) || 0,
        isTaxableForPayrollTax: item.isTaxableForPayrollTax,
        bonuses: [],
      })),
    }));
  }

  private persisting = false;
  private pendingPersist = false;

  private async persist(silent: boolean, reload: boolean): Promise<void> {
    const projection = this.projection();
    if (!projection || !this.isEditable()) {
      return;
    }
    if (this.persisting) {
      this.pendingPersist = true;
      return;
    }
    this.persisting = true;
    try {
      if (!silent) {
        this.saving.set(true);
      }
      await this.api.onPut<ISalaryProjection>(
        Endpoints.SalaryProjections.byId(projection.id),
        {
          name: projection.name,
          state: projection.state,
          scenarios: this.buildScenariosPayload(projection),
        },
        !silent, // showSuccess
        !silent, // showLoader
      );
      if (reload) {
        await this.load();
      }
    } finally {
      if (!silent) {
        this.saving.set(false);
      }
      this.persisting = false;
      if (this.pendingPersist) {
        this.pendingPersist = false;
        await this.persist(true, false);
      }
    }
  }

  private async persistProjection(): Promise<void> {
    await this.persist(true, false);
  }

  async runSimulation(): Promise<void> {
    const projection = this.projection();
    if (!projection) {
      return;
    }

    const items = projection.scenarios
      .flatMap((scenario) => scenario.items)
      .map((item) => ({
        itemId: item.id,
        isNewPosition: item.isNewPosition,
        workPositionId: item.workPositionId,
        employeeId: item.employeeId,
        netMonthlySalary: Number(item.netMonthlySalary) || 0,
        rcvEmployerFee: Number(item.rcvEmployerFee) || 0,
        infonavitEmployerFee: Number(item.infonavitEmployerFee) || 0,
        imssEmployerFee: Number(item.imssEmployerFee) || 0,
      }));

    if (items.length === 0) {
      this.simulations.set({});
      return;
    }

    this.simulating.set(true);
    try {
      const result = await this.api.onPost<ISalaryProjectionItemSimulation[]>(
        Endpoints.SalaryProjections.simulate,
        {
          cutOffDate: projection.targetYear ? `${projection.targetYear}-12-31` : this.todayIso(),
          items,
        },
        undefined,
        false,
        false,
      );

      if (result) {
        const map: Record<string, ISalaryProjectionItemSimulation> = {};
        for (const simulation of result) {
          map[simulation.itemId] = simulation;
        }
        this.simulations.set(map);
      }
    } finally {
      this.simulating.set(false);
    }
  }

  addNewPositionRow(): void {
    const projection = this.projection();
    const scenarioId = this.activeScenario()?.id;
    if (!projection || !scenarioId) {
      return;
    }
    const newItem: ISalaryProjectionItem = {
      id: crypto.randomUUID(),
      salaryProjectionScenarioId: scenarioId,
      isNewPosition: true,
      workPositionId: null,
      employeeId: null,
      numberEmployee: null,
      applicationUserId: null,
      employeeName: null,
      positionTitle: "",
      netMonthlySalary: 0,
      applicationRoleId: null,
      weeklyHours: null,
      dateAdmission: null,
      rcvEmployerFee: 0,
      infonavitEmployerFee: 0,
      imssEmployerFee: 0,
      isTaxableForPayrollTax: true,
      bonuses: [],
    };
    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, items: [...scenario.items, newItem] }
        : scenario,
    );
    this.projection.set({ ...projection, scenarios });
    this.queueAutoSave();
  }

  removeItem(itemId: string): void {
    const projection = this.projection();
    const scenarioId = this.activeScenario()?.id;
    if (!projection || !scenarioId) {
      return;
    }

    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            items: scenario.items.filter((item) => item.id !== itemId),
          }
        : scenario,
    );

    this.projection.set({ ...projection, scenarios });
    this.queueSimulation();
    this.queueAutoSave();
  }

  onSalaryChange(itemId: string, value: string | number): void {
    const projection = this.projection();
    const scenarioId = this.activeScenario()?.id;
    if (!projection || !scenarioId) {
      return;
    }
    const netMonthlySalary = Number(value) || 0;
    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            items: scenario.items.map((item) =>
              item.id === itemId ? { ...item, netMonthlySalary } : item,
            ),
          }
        : scenario,
    );
    this.projection.set({ ...projection, scenarios });
    this.queueSimulation();
    this.queueAutoSave();
  }

  onPositionTitleChange(itemId: string, value: string): void {
    const projection = this.projection();
    const scenarioId = this.activeScenario()?.id;
    if (!projection || !scenarioId) {
      return;
    }
    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            items: scenario.items.map((item) =>
              item.id === itemId ? { ...item, positionTitle: value } : item,
            ),
          }
        : scenario,
    );
    this.projection.set({ ...projection, scenarios });
    this.queueSimulation();
    this.queueAutoSave();
  }

  async saveProjection(): Promise<void> {
    await this.persist(false, true);
  }

  private todayIso(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  openEmployeeDetails(item: ISalaryProjectionItem): void {
    if (item?.applicationUserId) {
      this.dialogHandlerS.openDialog(
        CardEmployee,
        { applicationUserId: item.applicationUserId },
        "Colaborador",
        DialogSize.lg,
      );
    }
  }

  openScheduleDetails(workPositionId: string, positionTitle?: string): void {
    if (workPositionId) {
      this.dialogHandlerS.openDialog(
        WorkPositionHours,
        { id: workPositionId, applicationRoleName: positionTitle },
        positionTitle ? `Horarios - ${positionTitle}` : "Horarios de Trabajo",
        DialogSize.full,
      );
    }
  }
}
