import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { DecimalPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import {
  IFederalVacationParameter,
  IStateTaxParameter,
  mexicanStateText,
} from "../interfaces/salary-projections.models";
import { SalaryProjectionsService } from "../salary-projections.service";

type PayrollParameterKind = "federal" | "state";

const LIST_URL = "/hr/salary-projections";

@Component({
  selector: "app-payroll-parameter-config",
  templateUrl: "./payroll-parameter-config.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableEmptyMessage,
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
        border-color: var(--ds-border, #dee2e6);
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
export class PayrollParameterConfig {
  private readonly service = inject(SalaryProjectionsService);
  private readonly router = inject(Router);

  readonly federalParameters = signal<IFederalVacationParameter[]>([]);
  readonly stateTaxParameters = signal<IStateTaxParameter[]>([]);
  readonly loading = signal(true);

  // Sidepanel de edición.
  readonly editorOpen = signal(false);
  readonly editorKind = signal<PayrollParameterKind>("federal");
  readonly editorId = signal("");
  readonly editorLabel = signal("");
  readonly editorValue = signal(0);

  readonly stateText = mexicanStateText;

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    try {
      const [federal, stateTax] = await Promise.all([
        this.service.getFederalVacationParameters(),
        this.service.getStateTaxParameters(),
      ]);

      if (federal) {
        this.federalParameters.set(federal);
      }
      if (stateTax) {
        this.stateTaxParameters.set(stateTax);
      }
    } finally {
      this.loading.set(false);
    }
  }

  back(): void {
    void this.router.navigate([LIST_URL]);
  }

  openFederalEditor(row: IFederalVacationParameter): void {
    this.editorKind.set("federal");
    this.editorId.set(row.id);
    this.editorLabel.set(`${row.yearsOfService} años de antigüedad`);
    this.editorValue.set(row.vacationDays);
    this.editorOpen.set(true);
  }

  openStateEditor(row: IStateTaxParameter): void {
    this.editorKind.set("state");
    this.editorId.set(row.id);
    this.editorLabel.set(this.stateText(row.state));
    this.editorValue.set(row.employerPayrollTaxPercentage);
    this.editorOpen.set(true);
  }

  updateValue(value: string | number): void {
    this.editorValue.set(Number(value) || 0);
  }

  cancelEditor(): void {
    this.editorOpen.set(false);
  }

  async applyEditor(): Promise<void> {
    const id = this.editorId();
    const value = Number(this.editorValue()) || 0;

    if (this.editorKind() === "federal") {
      const updated = await this.service.updateFederalVacationParameter(id, value);
      if (updated) {
        this.federalParameters.update((rows) =>
          rows.map((row) => (row.id === id ? updated : row)),
        );
      }
    } else {
      const updated = await this.service.updateStateTaxParameter(id, value);
      if (updated) {
        this.stateTaxParameters.update((rows) =>
          rows.map((row) => (row.id === id ? updated : row)),
        );
      }
    }

    this.editorOpen.set(false);
  }
}
