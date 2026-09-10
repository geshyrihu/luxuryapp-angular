import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  IncidentWitnessAddOrEditDTO,
  IncidentWitnessDetailDTO,
} from "../interfaces/incident.interfaces";

interface IWitnessForm {
  fullName: import("@angular/forms").FormControl<string>;
  position: import("@angular/forms").FormControl<string>;
  phone: import("@angular/forms").FormControl<string>;
  statement: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-incident-witness-form",
  imports: [
    ReactiveFormsModule,
    InputMask,
    WebButtonLabelSave,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./incident-witness-form.html",
})
export class IncidentWitnessFormComponent implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private fb = inject(NonNullableFormBuilder);
  private config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);

  incidentId = signal<string>("");
  witnessId = signal<string | null>(null);
  saving = signal(false);

  form!: FormGroup<IWitnessForm>;

  ngOnInit(): void {
    this.incidentId.set(this.config.data?.incidentId ?? "");
    this.witnessId.set(this.config.data?.witnessId ?? null);

    this.form = this.fb.group<IWitnessForm>({
      fullName: this.fb.control("", [
        Validators.required,
        Validators.maxLength(200),
      ]),
      position: this.fb.control("", [Validators.maxLength(150)]),
      phone: this.fb.control(""),
      statement: this.fb.control("", [Validators.maxLength(2000)]),
    });

    if (this.witnessId()) {
      this.loadWitness();
    }
  }

  private loadWitness(): void {
    this.apiResponseS
      .onGetItem<IncidentWitnessDetailDTO>(
        Endpoints.HR.Incident.witnesses.getById(this.witnessId()!),
      )
      .then((result) => {
        if (result) {
          this.form.patchValue({
            fullName: result.fullName,
            position: result.position ?? "",
            phone: result.phone ?? "",
            statement: result.statement ?? "",
          });
        }
      });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.witnessId()
        ? Endpoints.HR.Incident.witnesses.update(this.witnessId()!)
        : Endpoints.HR.Incident.witnesses.add(this.incidentId()),
      id: this.witnessId() || null,
      ref: this.ref,
      submitting: this.saving,
      transformPayload: (value) => {
        const dto: IncidentWitnessAddOrEditDTO = {
          incidentId: this.incidentId(),
          fullName: value.fullName ?? "",
          position: value.position || undefined,
          phone: value.phone || undefined,
          statement: value.statement || undefined,
        };
        return dto;
      },
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
