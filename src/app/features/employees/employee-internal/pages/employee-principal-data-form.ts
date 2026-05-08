import { Component, inject, Input, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
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
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomButtonSave,
  ],
})
export class EmployeePrincipalDataForm implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  @Input() applicationUserId: string = "";

  submitting = signal(false);
  form: FormGroup<IEmployeePrincipalDataForm> = this.formB.group({
    id: new FormControl({ value: this.applicationUserId, disabled: true }),
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
    const urlApi = `EmployeeInternal/PrincipalData/${this.applicationUserId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    this.apiResponseS
      .onPut(
        `EmployeeInternal/UpdatePrincipalData/${this.applicationUserId}`,
        this.form.value,
      )
      .then(() => {
        this.submitting.set(false);
      });
  }
}
