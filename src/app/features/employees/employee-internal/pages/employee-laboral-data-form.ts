import { Component, inject, Input, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
// import { EmployeeAddOrEditService } from './employee-form.service';

import { IEmployeeLaboralDataForm } from "../models/employee-laboral-data-form.interface";

@Component({
  selector: "app-employee-laboral-data-form",
  templateUrl: "./employee-laboral-data-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputCurrencySignal,
    CustomInputNumberSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class EmployeeLaboralDataForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);
  @Input() applicationUserId: string = "";

  cb_type_contract = signal<ISelectItem[]>([]);
  cb_education_level = signal<ISelectItem[]>([]);
  cb_customer = signal<ISelectItem[]>([]);
  cb_state: ISelectItem[] = [
    {
      label: "Activo",
      value: true,
    },
    {
      label: "Inactivo",
      value: false,
    },
  ];

  submitting = signal(false);
  public AspRole = EApplicationRole;

  form: FormGroup<IEmployeeLaboralDataForm> = this.formB.group({
    // Person data
    dateAdmission: new FormControl<Date | string | null>(null, {
      validators: [Validators.required],
    }),
    customerId: new FormControl<string | null>("", {
      validators: [Validators.required],
    }),
    active: new FormControl<boolean | null>(null, {
      validators: [Validators.required],
    }),
    typePerson: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    salary: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    educationLevel: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),

    applicationUserId: new FormControl<string | null>(null),
    numberEmployee: new FormControl<number | null>(null, [
      Validators.min(1),
      Validators.max(9999),
    ]),
  });

  async ngOnInit() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`customers-active`)
      .then((response: any) => {
        this.cb_customer.set(response);
      });

    this.onLoadData();
    const typeContract = await firstValueFrom(this.enumSelectS.typeContract());
    this.cb_type_contract.set(typeContract);
    const educationLevel = await firstValueFrom(
      this.enumSelectS.educationLevel(),
    );
    this.cb_education_level.set(educationLevel);
  }
  onLoadData() {
    const urlApi = `EmployeeInternal/LaboralData/${this.applicationUserId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    this.apiResponseS
      .onPut(
        `EmployeeInternal/UpdateLaboralData/${this.applicationUserId}`,
        this.form.value,
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting.set(false);
      });
  }
}
