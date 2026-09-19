import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, debounceTime } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import {
  ISalaryProjection,
  ISalaryProjectionItem,
  ISalaryProjectionItemEdit,
  ISalaryProjectionItemSimulation,
  salaryProjectionStateSeverity,
  salaryProjectionStateText,
} from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";

const LIST_URL = "/hr/salary-projections";

@Component({
  selector: "app-salary-projections-detail",
  templateUrl: "./salary-projections-detail.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    AppSortableColumn,
    AppSorticon,
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-sm, 8px);
        padding: var(--ds-space-lg, 16px);
      }
      .app-sidepanel__header {
        border-bottom: 1px solid var(--ds-border, #dee2e6);
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
    `,
  ],
})
export class SalaryProjectionsDetail {
  private readonly service = inject(SalaryProjectionsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** ♻️ Cola de simulación con debounce para no saturar el backend. */
  private readonly simulateQueue = new Subject<void>();

  readonly projection = signal<ISalaryProjection | null>(null);
  readonly simulations = signal<Record<string, ISalaryProjectionItemSimulation>>({});
  readonly activeScenarioId = signal<string | null>(null);
  readonly loading = signal(true);
  readonly simulating = signal(false);
  readonly saving = signal(false);

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
        if (!data.scenarios.some((scenario) => scenario.id === currentScenarioId)) {
          this.activeScenarioId.set(data.scenarios[0]?.id ?? null);
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
        baseSalary: Number(item.baseSalary) || 0,
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

  openEditor(item: ISalaryProjectionItem): void {
    this.editorIsNew.set(false);
    this.editorDraft.set({
      id: item.id,
      isNewPosition: item.isNewPosition,
      employeeId: item.employeeId,
      positionTitle: item.positionTitle ?? "",
      baseSalary: item.baseSalary,
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
      baseSalary: 0,
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

  updateDraft(field: keyof ISalaryProjectionItemEdit, value: string | number | boolean): void {
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
        ? { ...scenario, items: scenario.items.filter((item) => item.id !== itemId) }
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
            baseSalary: Number(item.baseSalary) || 0,
            rcvEmployerFee: Number(item.rcvEmployerFee) || 0,
            infonavitEmployerFee: Number(item.infonavitEmployerFee) || 0,
            imssEmployerFee: Number(item.imssEmployerFee) || 0,
            isTaxableForPayrollTax: item.isTaxableForPayrollTax,
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
      positionTitle: draft.positionTitle,
      baseSalary: Number(draft.baseSalary) || 0,
      rcvEmployerFee: Number(draft.rcvEmployerFee) || 0,
      infonavitEmployerFee: Number(draft.infonavitEmployerFee) || 0,
      imssEmployerFee: Number(draft.imssEmployerFee) || 0,
      isTaxableForPayrollTax: draft.isTaxableForPayrollTax,
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
              baseSalary: Number(draft.baseSalary) || 0,
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
}
