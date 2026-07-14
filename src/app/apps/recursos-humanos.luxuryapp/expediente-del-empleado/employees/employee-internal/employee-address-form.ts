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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
// import { EmployeeAddOrEditService } from './employee-form.service';

import { IEmployeeAddressForm } from "./interfaces/employee-address-form.interface";

@Component({
  selector: "app-employee-address-form",
  templateUrl: "./employee-address-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSave],
})
export class EmployeeAddressForm implements OnInit {
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  employeeId = input<string>("");

  addressId: string = "";
  submitting = signal(false);

  form: FormGroup<IEmployeeAddressForm> = this.formB.group({
    id: new FormControl(""),
    city: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(20)],
      nonNullable: true,
    }),
    district: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true,
    }),
    townHall: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(20)],
      nonNullable: true,
    }),
    number: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    unitNumber: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(20)],
      nonNullable: true,
    }),
    street: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(60)],
      nonNullable: true,
    }),
    zipCode: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(10)],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EmployeeInternal.addressData(this.employeeId()))
      .then((result: any) => {
        this.form.patchValue(result);
        this.addressId = result.id;
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updateAddressData(this.addressId),
        this.form.value,
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting.set(false);
      });
  }
}
