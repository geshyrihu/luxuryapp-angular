import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { UnitOfMeasurementFormGroup } from "./interfaces/unit-of-measurement-form.interface";

@Component({
  selector: "app-unit-of-measurement-form",
  templateUrl: "./unit-of-measurement-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSave],
})
export class UnitOfMeasurementForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);
  submitting = signal(false);

  id: string = "";

  form: FormGroup<UnitOfMeasurementFormGroup> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    descripcion: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.UnitsOfMeasurement.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.UnitsOfMeasurement.getAll,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
