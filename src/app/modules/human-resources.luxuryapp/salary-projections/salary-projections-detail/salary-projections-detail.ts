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
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppTable } from "@ui/web/table/table";
import { Subject, debounceTime } from "rxjs";
import {
  ISalaryProjection,
  ISalaryProjectionItem,
  ISalaryProjectionItemEdit,
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
    CustomInputTextSignal,
    FormsModule,
    DatePipe,
    DecimalPipe,
  ],
  styles: [
    `
      .app-sidepanel-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        z-index: 1040;
      }
      .app-sidepanel {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: min(480px, 100vw);
        background: var(--ds-bg-surface, #ffffff);
        z-index: 1041;
        display: flex;
        flex-direction: column;
        box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15);
      }
      .app-sidepanel__header,
      .app-sidepanel__footer {
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        border-bottom: 1px solid var(--ds-border, #e5e7eb);
      }
      .app-sidepanel__header {
        justify-content: space-between;
      }
      .app-sidepanel__footer {
        justify-content: flex-end;
        border-bottom: none;
        border-top: 1px solid var(--ds-border, #e5e7eb);
      }
      .app-sidepanel__body {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

    `,
  ],
})
export class SalaryProjectionsDetail {
  private readonly api = inject(ApiResponseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  /** ♻️ Cola de simulación con debounce para no saturar el backend. */
  private readonly simulateQueue = new Subject<void>();

  readonly projection = signal<ISalaryProjection | null>(null);
  readonly simulations = signal<
    Record<string, ISalaryProjectionItemSimulation>
  >({});

  readonly loading = signal(true);
  readonly simulating = signal(false);
  readonly saving = signal(false);
  readonly submitting = signal(false);

  readonly activeScenarioId = signal<string | null>(null);

  /** Control del panel lateral para edición rápida. */
  readonly editingItem = signal<ISalaryProjectionItemEdit | null>(null);

  // Sidepanel de edición de fila.
  readonly editorOpen = signal(false);
  readonly editorIsNew = signal(false);
  readonly editorDraft = signal<ISalaryProjectionItemEdit | null>(null);

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
        rcvEmployerFee += item.rcvEmployerFee || 0;
        infonavitEmployerFee += item.infonavitEmployerFee || 0;
        imssEmployerFee += item.imssEmployerFee || 0;

        const sim = sims[item.id];
        if (sim) {
          vacationPremium += sim.vacationPremium || 0;
          holidayPremium += sim.holidayPremium || 0;
          sundayPremium += sim.sundayPremium || 0;
          christmasBonus += sim.christmasBonus || 0;
          monthlyPerceptions += sim.monthlyPerceptions || 0;
          employerPayrollTax += sim.employerPayrollTax || 0;
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
          cutOffDate: this.todayIso(),
          items,
        },
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

  openEditor(item: ISalaryProjectionItem, scenarioId?: string): void {
    if (scenarioId) {
      this.activeScenarioId.set(scenarioId);
    }
    this.editorIsNew.set(false);
    this.editorDraft.set({
      id: item.id,
      isNewPosition: item.isNewPosition,
      employeeId: item.employeeId,
      positionTitle: item.positionTitle ?? "",
      netMonthlySalary: item.netMonthlySalary,
      applicationRoleId: item.applicationRoleId,
      weeklyHours: item.weeklyHours,
      dateAdmission: item.dateAdmission,
      rcvEmployerFee: item.rcvEmployerFee,
      infonavitEmployerFee: item.infonavitEmployerFee,
      imssEmployerFee: item.imssEmployerFee,
      isTaxableForPayrollTax: item.isTaxableForPayrollTax,
    });
    this.editorOpen.set(true);
  }

  openNewPosition(): void {
    this.editorIsNew.set(true);
    this.editorDraft.set({
      id: crypto.randomUUID(),
      isNewPosition: true,
      employeeId: null,
      positionTitle: "",
      netMonthlySalary: 0,
      applicationRoleId: null,
      weeklyHours: null,
      dateAdmission: null,
      rcvEmployerFee: 0,
      infonavitEmployerFee: 0,
      imssEmployerFee: 0,
      isTaxableForPayrollTax: true,
    });
    this.editorOpen.set(true);
  }

  cancelEditor(): void {
    this.editorOpen.set(false);
    this.editorDraft.set(null);
  }

  updateDraft(
    field: keyof ISalaryProjectionItemEdit,
    value: string | number | boolean,
  ): void {
    const draft = this.editorDraft();
    if (!draft) {
      return;
    }
    this.editorDraft.set({ ...draft, [field]: value });
  }

  applyEditor(): void {
    const draft = this.editorDraft();
    const scenarioId = this.activeScenario()?.id;
    if (!draft || !scenarioId) {
      return;
    }

    if (this.editorIsNew()) {
      this.addItem(scenarioId, draft);
    } else {
      this.patchItem(draft.id, draft);
    }

    this.editorOpen.set(false);
    this.editorDraft.set(null);
    this.queueSimulation();
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
  }

  async saveProjection(): Promise<void> {
    const projection = this.projection();
    if (!projection) {
      return;
    }

    this.saving.set(true);
    try {
      await this.api.onPut<ISalaryProjection>(
        Endpoints.SalaryProjections.byId(projection.id),
        {
          name: projection.name,
          state: projection.state,
          scenarios: projection.scenarios.map((scenario) => ({
            name: scenario.name,
            description: scenario.description,
            items: scenario.items.map((item) => ({
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
          })),
        },
      );

      await this.load();
    } finally {
      this.saving.set(false);
    }
  }

  private addItem(scenarioId: string, draft: ISalaryProjectionItemEdit): void {
    const projection = this.projection();
    if (!projection) {
      return;
    }

    const newItem: ISalaryProjectionItem = {
      id: draft.id,
      salaryProjectionScenarioId: scenarioId,
      isNewPosition: draft.isNewPosition,
      workPositionId: null,
      employeeId: draft.employeeId,
      numberEmployee: null,
      applicationUserId: null,
      employeeName: null,
      positionTitle: draft.positionTitle,
      netMonthlySalary: Number(draft.netMonthlySalary) || 0,
      applicationRoleId: draft.applicationRoleId,
      weeklyHours: draft.weeklyHours,
      dateAdmission: draft.dateAdmission,
      rcvEmployerFee: Number(draft.rcvEmployerFee) || 0,
      infonavitEmployerFee: Number(draft.infonavitEmployerFee) || 0,
      imssEmployerFee: Number(draft.imssEmployerFee) || 0,
      isTaxableForPayrollTax: draft.isTaxableForPayrollTax,
      bonuses: [],
    };

    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, items: [...scenario.items, newItem] }
        : scenario,
    );

    this.projection.set({ ...projection, scenarios });
  }

  private patchItem(itemId: string, draft: ISalaryProjectionItemEdit): void {
    const projection = this.projection();
    const scenarioId = this.activeScenarioId();
    if (!projection || !scenarioId) {
      return;
    }

    const scenarios = projection.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? {
            ...scenario,
            items: scenario.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    positionTitle: draft.positionTitle,
                    netMonthlySalary: Number(draft.netMonthlySalary) || 0,
                    applicationRoleId: draft.applicationRoleId,
                    weeklyHours: draft.weeklyHours,
                    dateAdmission: draft.dateAdmission,
                    rcvEmployerFee: Number(draft.rcvEmployerFee) || 0,
                    infonavitEmployerFee: Number(draft.infonavitEmployerFee) || 0,
                    imssEmployerFee: Number(draft.imssEmployerFee) || 0,
                    isTaxableForPayrollTax: draft.isTaxableForPayrollTax,
                  }
                : item,
            ),
          }
        : scenario,
    );

    this.projection.set({ ...projection, scenarios });
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
