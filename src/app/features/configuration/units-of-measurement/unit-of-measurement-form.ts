import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

interface IUnitOfMeasurementForm {
  id: FormControl<string | null>;
  descripcion: FormControl<string>;
  // user: FormControl<string | null>; // Not used in form group
}

@Component({
  selector: "app-unit-of-measurement-form",
  templateUrl: "./unit-of-measurement-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class UnitOfMeasurementForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authService = inject(AuthService);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<IUnitOfMeasurementForm> = this.formB.group({
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
      .onGetItem(`UnidadMedida/${this.id}`)
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "UnidadMedida",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}









