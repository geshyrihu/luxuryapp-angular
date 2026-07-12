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
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { firstValueFrom } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
// import { EmployeeAddOrEditService } from './employee-form.service';

import { IEmployeeLaboralDataForm } from './interfaces/employee-laboral-data-form.interface';

@Component({
  selector: "app-employee-laboral-data-form",
  templateUrl: "./employee-laboral-data-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputCurrencySignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
  ],
})
export class EmployeeLaboralDataForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  // employeeAddOrEditService = inject(EmployeeAddOrEditService);
  enumSelectS = inject(EnumSelectService);
  dateS = inject(DateService);
  formB = inject(FormBuilder);
  applicationUserId = input<string>("");

  cb_type_contract = signal<SelectItemDto[]>([]);
  cb_education_level = signal<SelectItemDto[]>([]);
  cb_customer = signal<SelectItemDto[]>([]);
  cb_state: SelectItemDto[] = [
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
  public AspRole = ApplicationRole;

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
    dailySalary: new FormControl<number | null>({
      value: null,
      disabled: true,
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
    this.form.controls.salary.valueChanges.subscribe((val) => {
      const daily = val ? val / 30.46 : null;
      this.form.controls.dailySalary.setValue(daily);
    });

    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.customersActive)
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
    this.apiResponseS
      .onGetItem(
        Endpoints.EmployeeInternal.laboralData(this.applicationUserId()),
      )
      .then((result: any) => {
        this.form.patchValue(result);
        if (result.salary) {
          this.form.controls.dailySalary.setValue(result.salary / 30.46);
        }
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const payload = {
      ...this.form.value,
      dateAdmission: this.dateS.getDateFormat(
        this.form.value.dateAdmission as any,
      ),
    };

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updateLaboralData(this.applicationUserId()),
        payload,
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.submitting.set(false);
      });
  }
}
