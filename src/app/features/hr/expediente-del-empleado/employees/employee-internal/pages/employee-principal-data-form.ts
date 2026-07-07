import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputMaskSignal } from "@ui/inputs/web/custom-input-mask-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
// import { EmployeeAddOrEditService } from './employee-form.service';

interface IEmployeePrincipalDataForm {
  id: FormControl<string | null>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string>;
}

@Component({
  selector: "employee-principal-data-form",
  templateUrl: "./employee-principal-data-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    WebButtonLabelSave,
  ],
})
export class EmployeePrincipalDataForm implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  applicationUserId = input<string>("");

  submitting = signal(false);
  form: FormGroup<IEmployeePrincipalDataForm> = this.formB.group({
    id: new FormControl({ value: this.applicationUserId(), disabled: true }),
    email: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    firstName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    lastName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    phoneNumber: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });
  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.principalData(this.applicationUserId()),
      )
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updatePrincipalData(
          this.applicationUserId(),
        ),
        this.form.value,
      )
      .then(() => {
        this.submitting.set(false);
      });
  }
}
