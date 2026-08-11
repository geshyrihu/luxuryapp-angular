import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { InputEmail } from "@ui/inputs/adaptive/input-email/input-email";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { lastValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateAddOrEdit } from "./interfaces/candidate.dto";
import { CandidateFormGroup } from "./interfaces/candidate-form.interface";

@Component({
  selector: "app-candidate-form",
  templateUrl: "./candidate-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomInputToggleSwitch,
    InputMask,
    InputEmail,
    WebButtonLabelSave,
  ],
})
export class CandidateForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);

  id: string = "";
  submitting = signal(false);
  cb_recruitmentSource = signal<SelectItemDto[]>([]);

  form: FormGroup<CandidateFormGroup> = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    firstName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    lastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    phoneNumber: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    age: new FormControl<number | null>(null),
    currentAddress: new FormControl<string | null>(null),
    livesNearWorkplace: new FormControl<boolean | null>(null),
    availability: new FormControl<string | null>(null),
    salaryExpectation: new FormControl<number | null>(null),
    experienceSummary: new FormControl<string | null>(null),
    recruitmentSource: new FormControl<number | null>(null),
    generalComments: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    await this.onLoadSelectItems();
    if (this.id) this.onLoadData();
  }

  async onLoadSelectItems(): Promise<void> {
    const sources = await lastValueFrom(this.enumSelectS.fuenteReclutamiento());
    this.cb_recruitmentSource.set(sources);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CandidateAddOrEdit>(
        EndpointsReclutamiento.Candidates.getById(this.id),
      )
      .then((result) => {
        if (result) this.form.patchValue(result);
      });
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: EndpointsReclutamiento.Candidates.base,
      id: this.id,
      ref: undefined,
      submitting: this.submitting,
    });

    if (result !== false) {
      this.ref.close(result);
    }
  }
}
