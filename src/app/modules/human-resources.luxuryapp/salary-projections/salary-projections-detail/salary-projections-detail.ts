import { DecimalPipe } from "@angular/common";
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
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppTable } from "@ui/web/table/table";
import { DialogHandlerService, DialogSize } from "@core/services/dialog-handler.service";
import { CardEmployee } from "@recruitment.luxuryapp/expediente-del-empleado/employees/employees/card-employee";
import { WorkPositionForm } from "@operations.luxuryapp/work-position/work-position-form";
import { Subject, debounceTime } from "rxjs";
import {
  ISalaryProjection,
  ISalaryProjectionItem,
  ISalaryProjectionItemEdit,
  ISalaryProjectionItemSimulation,
  ISalaryProjectionScenario,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";

const LIST_URL = "/hr/salary-projections";

interface ComparisonCell {
  scenarioId: string;
  scenarioName: string;
  item: ISalaryProjectionItem | null;
  simulation: ISalaryProjectionItemSimulation | null;
}

interface ComparisonRow {
  key: string;
  positionTitle: string;
  applicationRoleId: string | null;
  comparisons: ComparisonCell[];
}

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
        border-top: 1px solid var(--ds-border, #dee2e6);
      }
      .app-sidepanel__body {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-lg, 16px);
        padding: var(--ds-space-lg, 16px);
        overflow-y: auto;
        flex: 1;
      }
      .comparison-bar {
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background: var(--ds-bg-muted, #e9ecef);
      }
      .comparison-bar span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background: var(--ds-action-primary, #0d6efd);
        transition: width 180ms ease-out;
      }
      .comparison-cell {
        cursor: pointer;
      }
      .comparison-cell:hover {
        background: var(--ds-bg-subtle, #f8f9fa);
      }
    `,
  ],
})
export class SalaryProjectionsDetail {
  private readonly service = inject(SalaryProjectionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  /** ♻️ Cola de simulación con debounce para no saturar el backend. */
  private readonly simulateQueue = new Subject<void>();

  readonly projection = signal<ISalaryProjection | null>(null);
  readonly simulations = signal<
    Record<string, ISalaryProjectionItemSimulation>
  >({});
  readonly activeScenarioId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly simulating = signal(false);
  readonly saving = signal(false);
  readonly selectedScenarioIds = signal<string[]>([]);

  // Sidepanel de edición de fila.
  readonly editorOpen = signal(false);
  readonly editorIsNew = signal(false);
  readonly editorDraft = signal<ISalaryProjectionItemEdit | null>(null);

  readonly stateText = salaryProjectionStateText;
  readonly stateSeverity = salaryProjectionStateSeverity;

  readonly scenarios = computed(() => this.projection()?.scenarios ?? []);

  readonly activeScenario = computed(() => {
    const scenarios = this.scenarios();
    return (
      scenarios.find((scenario) => scenario.id === this.activeScenarioId()) ??
      scenarios[0] ??
      null
    );
  });

  readonly activeItems = computed(() => this.activeScenario()?.items ?? []);

  readonly comparedScenarios = computed(() => {
    const scenarios = this.scenarios();
    const selectedIds = this.selectedScenarioIds();
    return selectedIds.length > 0
      ? scenarios.filter((scenario) => selectedIds.includes(scenario.id))
      : scenarios.slice(0, 3);
  });

  readonly comparisonRows = computed<ComparisonRow[]>(() => {
    const scenarios = this.comparedScenarios();
    const rows = new Map<string, Omit<ComparisonRow, "comparisons">>();

    for (const scenario of scenarios) {
      for (const item of scenario.items) {
        const key =
          item.workPositionId ?? item.applicationRoleId ?? item.positionTitle;
        if (!rows.has(key)) {
          rows.set(key, {
            key,
            positionTitle: item.positionTitle || "Sin título",
            applicationRoleId: item.applicationRoleId,
          });
        }
      }
    }

      const sims = this.simulations();
      return [...rows.values()].map((row) => ({
        ...row,
        comparisons: scenarios.map((scenario) => {
          const item =
            scenario.items.find(
              (i) =>
                (i.workPositionId && i.workPositionId === row.key) ||
                (!i.workPositionId && i.applicationRoleId === row.key) ||
                (!i.workPositionId &&
                  !i.applicationRoleId &&
                  i.positionTitle === row.key),
            ) || null;

          return {
            scenarioId: scenario.id,
            scenarioName: scenario.name,
            item,
            simulation: item ? this.simulationOf(item.id) : null,
          };
        }),
      }));
  });

  readonly scenarioTotals = computed<Record<string, ISalaryProjectionItemSimulation & { netMonthlySalary: number, rcvEmployerFee: number, infonavitEmployerFee: number, imssEmployerFee: number }>>(() => {
    const scenarios = this.comparedScenarios();
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
        totalEmployerCost
      };
    }

    return totals;
  });

  readonly comparisonScenarioTotals = computed(() =>
    this.comparedScenarios().map((scenario) => ({
      scenario,
      total: scenario.items.reduce(
        (total, item) =>
          total + (this.simulations()[item.id]?.totalEmployerCost ?? 0),
        0,
      ),
    })),
  );

  readonly comparisonMaxTotal = computed(() =>
    Math.max(...this.comparisonScenarioTotals().map((entry) => entry.total), 1),
  );

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
      const data = await this.service.getById(id);
      if (data) {
        this.projection.set(data);
        const currentScenarioId = this.activeScenarioId();
        if (
          !data.scenarios.some((scenario) => scenario.id === currentScenarioId)
        ) {
          this.activeScenarioId.set(data.scenarios[0]?.id ?? null);
        }
        const availableIds = data.scenarios
          .slice(0, 3)
          .map((scenario) => scenario.id);
        if (
          this.selectedScenarioIds().length === 0 ||
          this.selectedScenarioIds().every(
            (scenarioId) =>
              !data.scenarios.some((scenario) => scenario.id === scenarioId),
          )
        ) {
          this.selectedScenarioIds.set(availableIds);
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
    if (
      !this.selectedScenarioIds().includes(scenarioId) &&
      this.selectedScenarioIds().length < 3
    ) {
      this.selectedScenarioIds.update((ids) => [...ids, scenarioId]);
    }
  }

  toggleScenarioComparison(scenarioId: string): void {
    const selectedIds = this.selectedScenarioIds();
    if (selectedIds.includes(scenarioId)) {
      if (selectedIds.length === 1) {
        return;
      }
      this.selectedScenarioIds.set(
        selectedIds.filter((id) => id !== scenarioId),
      );
      if (this.activeScenarioId() === scenarioId) {
        this.activeScenarioId.set(this.selectedScenarioIds()[0] ?? null);
      }
      return;
    }

    if (selectedIds.length < 3) {
      this.selectedScenarioIds.set([...selectedIds, scenarioId]);
    }
  }

  isScenarioSelected(scenarioId: string): boolean {
    return this.selectedScenarioIds().includes(scenarioId);
  }

  comparisonBarWidth(total: number): string {
    return `${Math.max((total / this.comparisonMaxTotal()) * 100, total > 0 ? 4 : 0)}%`;
  }

  scenarioItemCount(scenario: ISalaryProjectionScenario): number {
    return scenario.items.length;
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
      const result = await this.service.simulate({
        cutOffDate: this.todayIso(),
        items,
      });

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

  async saveProjection(): Promise<void> {
    const projection = this.projection();
    if (!projection || this.saving()) {
      return;
    }

    this.saving.set(true);
    try {
      await this.service.update(projection.id, {
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
      });

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
    if (!projection) {
      return;
    }

    const scenarios = projection.scenarios.map((scenario) => ({
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
    }));

    this.projection.set({ ...projection, scenarios });
  }

  private todayIso(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
  }

  openEmployeeDetails(row: ComparisonRow): void {
    const item = row.comparisons[0]?.item;
    if (item?.applicationUserId) {
      this.dialogHandlerS.openDialog(
        CardEmployee,
        { applicationUserId: item.applicationUserId },
        "Colaborador",
        DialogSize.sm,
      );
    }
  }

  openScheduleDetails(workPositionId: string): void {
    if (workPositionId) {
      this.dialogHandlerS.openDialog(
        WorkPositionForm,
        { id: workPositionId },
        "Detalles del Puesto",
        DialogSize.full,
      );
    }
  }
}
