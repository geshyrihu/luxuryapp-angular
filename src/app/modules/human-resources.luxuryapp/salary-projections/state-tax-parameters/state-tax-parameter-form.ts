import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule, FormControl, ReactiveFormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { IStateTaxParameter, MEXICAN_STATES } from "../interfaces/salary-projections.models";
import { ApiResponseService } from '@core/http/services/api-response.service';
import { Endpoints } from '@core/constants/endpoints/endpoints';

@Component({
  selector: "app-state-tax-parameter-form",
  templateUrl: "./state-tax-parameter-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, CustomInputSelectSignal, CustomInputTextSignal, WebButtonLabel],
})
export class StateTaxParameterForm {
  private readonly api = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  readonly saving = signal(false);
  readonly row = signal<IStateTaxParameter | null>(null);
  readonly stateControl = new FormControl<number>(0, { nonNullable: true });
  readonly stateOptions: SelectItemDto<number>[] = MEXICAN_STATES.map((label, value) => ({ label, value }));
  readonly year = signal(new Date().getFullYear());
  readonly percentage = signal(0.04);

  constructor() {
    const row = this.config.data?.row as IStateTaxParameter | undefined;
    if (row) {
      this.row.set(row);
      this.stateControl.setValue(row.state);
      this.year.set(row.year);
      this.percentage.set(row.employerPayrollTaxPercentage);
    }
  }

  async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const result = this.row()
        ? await this.api.onPut<IStateTaxParameter>(Endpoints.SalaryProjections.stateTaxParameter(this.stateControl.value, this.year()), { employerPayrollTaxPercentage: this.percentage() })
        : await this.api.onPost<IStateTaxParameter>(Endpoints.SalaryProjections.stateTaxParameters, { state: this.stateControl.value, year: this.year(), employerPayrollTaxPercentage: this.percentage() });
      if (result) this.ref.close(true);
    } finally { this.saving.set(false); }
  }

  close(): void { this.ref.close(false); }
}

