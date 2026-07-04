import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { EmployeeInternalService } from "../../employee-internal/services/employee-internal.service";
import { IEmployeeClinicalDataForm } from "../models/employee-clinical-data.interface";

@Component({
  selector: "app-employee-clinical-data-form",
  templateUrl: "./employee-clinical-data-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class EmployeeClinicalDataForm implements OnInit {
  private readonly employeeInternalS = inject(EmployeeInternalService);
  private readonly apiResponseS = inject(ApiResponseService);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id = this.config.data?.id || "";
  submitting = signal(false);

  form = new FormGroup({
    id: new FormControl<string>(this.id, { nonNullable: true }),
    employeeId: new FormControl<string>(this.config.data.employeeId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.maxLength(50)],
    }),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    if (this.id) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.employeeInternalS.getClinicalDataById(this.id).then((result) => {
      if (result) {
        this.form.patchValue(result);
      }
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form as FormGroup,
      api: this.apiResponseS,
      endpoint: Endpoints.EmployeeClinicalData.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value: IEmployeeClinicalDataForm) => ({
        ...value,
        employeeId: this.config.data.employeeId,
      }),
    });
  }
}
