import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { IFederalVacationParameter } from "../interfaces/salary-projections.models";
import { ApiResponseService } from '@core/http/services/api-response.service';
import { Endpoints } from '@core/constants/endpoints/endpoints';

@Component({
  selector: "app-federal-vacation-parameter-form",
  templateUrl: "./federal-vacation-parameter-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CustomInputTextSignal, WebButtonLabel],
})
export class FederalVacationParameterForm {
  private readonly api = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  readonly saving = signal(false);
  readonly row = signal<IFederalVacationParameter | null>(null);
  readonly year = signal(new Date().getFullYear());
  readonly yearsOfService = signal(0);
  readonly vacationDays = signal(0);

  constructor() {
    const row = this.config.data?.row as IFederalVacationParameter | undefined;
    if (row) {
      this.row.set(row);
      this.year.set(row.year);
      this.yearsOfService.set(row.yearsOfService);
      this.vacationDays.set(row.vacationDays);
    }
  }

  async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const result = this.row()
        ? await this.api.onPut<IFederalVacationParameter>(Endpoints.SalaryProjections.federalVacationParameter(this.yearsOfService(), this.year()), { vacationDays: this.vacationDays() })
        : await this.api.onPost<IFederalVacationParameter>(Endpoints.SalaryProjections.federalVacationParameters, { year: this.year(), yearsOfService: this.yearsOfService(), vacationDays: this.vacationDays() });
      if (result) this.ref.close(true);
    } finally { this.saving.set(false); }
  }

  close(): void { this.ref.close(false); }
}

