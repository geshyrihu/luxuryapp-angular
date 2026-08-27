import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LxRadioButton } from "@ui/adaptive/radio-button/radio-button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Component({
  selector: "app-confirm-presentation-modal",

  imports: [
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputDateSignal,
    LxRadioButton,
  ],
  templateUrl: "./confirm-presentation-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmPresentationModal {
  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);
  readonly apiS = inject(ApiResponseService);
  readonly fb = inject(FormBuilder);

  readonly processId = signal<string>(this.config.data.processId);
  readonly candidateName = signal<string>(this.config.data.candidateName);
  readonly vacancyFolio = signal<string>(this.config.data.vacancyFolio);

  readonly form = this.fb.group({
    isPresented: [null as boolean | null, Validators.required],
    status: [null as string | null],
    newPresentationDate: [null as string | null],
  });

  readonly saving = signal(false);

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const val = this.form.value;
    const payload = {
      isPresented: val.isPresented,
      status: val.status,
      newPresentationDate: val.newPresentationDate,
    };
    this.saving.set(true);
    try {
      const res = await this.apiS.onPost(
        Endpoints.CandidateProcesses.base +
          "/" +
          this.processId() +
          "/presentation-result",
        payload,
      );
      if (res && true === true) {
        this.ref.close(true);
      } else {
        this.saving.set(false);
      }
    } catch {
      this.saving.set(false);
    }
  }
  close() {
    this.ref.close();
  }
}
