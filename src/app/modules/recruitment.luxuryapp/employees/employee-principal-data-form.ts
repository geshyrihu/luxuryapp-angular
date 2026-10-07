import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
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
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
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
  imports: [ReactiveFormsModule, LuxInputTextSignal, InputMask, ButtonWeb],
})
export class EmployeePrincipalDataForm implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  applicationUserId = input<string>("");
  isReadOnly = input<boolean>(false);

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
    if (this.isReadOnly()) {
      this.form.disable();
    }
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
