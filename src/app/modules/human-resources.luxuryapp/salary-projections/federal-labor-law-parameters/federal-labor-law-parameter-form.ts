import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { IFederalLaborLawParameter } from "../interfaces/salary-projections.models";
import { ApiResponseService } from '@core/http/services/api-response.service';
import { Endpoints } from '@core/constants/endpoints/endpoints';

@Component({
  selector: "app-federal-labor-law-parameter-form",
  templateUrl: "./federal-labor-law-parameter-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CustomInputTextSignal, WebButtonLabel],
})
export class FederalLaborLawParameterForm {
  private readonly api = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  readonly saving = signal(false);
  readonly row = signal<IFederalLaborLawParameter | null>(null);
  readonly year = signal(new Date().getFullYear());
  readonly christmasBonusDays = signal(15);
  readonly vacationPremiumPercentage = signal(0.25);
  readonly sundayPremiumPercentage = signal(0.25);

  constructor() {
    const row = this.config.data?.row as IFederalLaborLawParameter | undefined;
    if (row) {
      this.row.set(row);
      this.year.set(row.year);
      this.christmasBonusDays.set(row.christmasBonusDays);
      this.vacationPremiumPercentage.set(row.vacationPremiumPercentage);
      this.sundayPremiumPercentage.set(row.sundayPremiumPercentage);
    }
  }

  async submit(): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      const result = this.row()
        ? await this.api.onPut<IFederalLaborLawParameter>(Endpoints.SalaryProjections.federalLaborLawParameter(this.year()), {
            christmasBonusDays: this.christmasBonusDays(),
            vacationPremiumPercentage: this.vacationPremiumPercentage(),
            sundayPremiumPercentage: this.sundayPremiumPercentage(),
          })
        : await this.api.onPost<IFederalLaborLawParameter>(Endpoints.SalaryProjections.federalLaborLawParameters, {
            year: this.year(),
            christmasBonusDays: this.christmasBonusDays(),
            vacationPremiumPercentage: this.vacationPremiumPercentage(),
            sundayPremiumPercentage: this.sundayPremiumPercentage(),
          });
      if (result) this.ref.close(true);
    } finally { this.saving.set(false); }
  }

  close(): void { this.ref.close(false); }
}


