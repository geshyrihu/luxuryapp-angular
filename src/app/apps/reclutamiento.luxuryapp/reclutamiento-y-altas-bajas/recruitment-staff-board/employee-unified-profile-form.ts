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
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { InputToggleSwitch } from "@ui/inputs/adaptive/input-toggle-switch/input-toggle-switch";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputPhonePrefix } from "@ui/inputs/web/custom-input-phone-prefix";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { firstValueFrom } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ECountry } from "src/app/core/enums/paises.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface EmployeeUnifiedProfileFormControls {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumberPrefix: FormControl<string>;
  phoneNumber: FormControl<string>;
  email: FormControl<string>;
  birth: FormControl<Date | string | null>;
  bloodType: FormControl<number | null>;
  curp: FormControl<string>;
  localPhone: FormControl<string>;
  maritalStatus: FormControl<number | null>;
  nationality: FormControl<SelectItemDto | string | null>;
  nss: FormControl<string>;
  rfc: FormControl<string>;
  rfcPostalCode: FormControl<string>;
  sex: FormControl<number | null>;
  hasInfonavitCredit: FormControl<boolean>;
  infonavitCreditNumber: FormControl<string>;
  infonavitDiscountFactor: FormControl<string>;
  hasFonacotCredit: FormControl<boolean>;
  fonacotCreditNumber: FormControl<string>;
  fonacotDiscountFactor: FormControl<string>;
  city: FormControl<string>;
  district: FormControl<string>;
  townHall: FormControl<string>;
  number: FormControl<string>;
  unitNumber: FormControl<string>;
  street: FormControl<string>;
  zipCode: FormControl<string>;
  dateAdmission: FormControl<Date | string | null>;
  customerId: FormControl<string | null>;
  active: FormControl<boolean | null>;
  typePerson: FormControl<number | null>;
  salary: FormControl<number | null>;
  dailySalary: FormControl<number | null>;
  educationLevel: FormControl<number | null>;
  numberEmployee: FormControl<number | null>;
}

@Component({
  selector: "app-employee-unified-profile-form",
  templateUrl: "./employee-unified-profile-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .employee-identity-grid {
        display: grid;
        grid-template-columns: minmax(250px, 4fr) minmax(0, 9fr);
        gap: 1rem;
        align-items: stretch;
      }

      .employee-photo-card,
      .employee-identity-card {
        height: 100%;
      }

      .employee-photo-card .card-body {
        min-height: 100%;
      }

      @media (max-width: 991px) {
        .employee-identity-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputMask,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    InputAutocomplete,
    CustomInputCurrencySignal,
    CustomInputNumberSignal,
    CustomInputPhonePrefix,
    InputToggleSwitch,
    InputImg,
    WebButtonLabelSave,
  ],
  providers: [provideFlatpickrDefaults()],
})
export class EmployeeUnifiedProfileForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private aspRoleS = inject(AspRoleService);
  private dateS = inject(DateService);
  private enumSelectS = inject(EnumSelectService);
  private formB = inject(FormBuilder);

  employeeId = input<string>("");
  applicationUserId = input<string>("");

  readonly AspRole = ApplicationRole;
  submitting = signal(false);
  invalidFields = signal<string[]>([]);
  photoPath = signal("");
  imgUpload = signal<File | null>(null);
  imgTemp = signal<string | ArrayBuffer | null>(null);

  cb_blood_type = signal<SelectItemDto[]>([]);
  cb_customer = signal<SelectItemDto[]>([]);
  cb_education_level = signal<SelectItemDto[]>([]);
  cb_marital_status = signal<SelectItemDto[]>([]);
  cb_nationality = signal<SelectItemDto[]>([]);
  cb_sex = signal<SelectItemDto[]>([]);
  cb_type_contract = signal<SelectItemDto[]>([]);
  cb_state = signal<SelectItemDto[]>([
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ]);
  private readonly fieldLabels: Partial<
    Record<keyof EmployeeUnifiedProfileFormControls, string>
  > = {
    firstName: "Nombre",
    lastName: "Apellidos",
    phoneNumberPrefix: "Prefijo telefónico",
    phoneNumber: "Tél. celular",
    email: "Email personal",
    birth: "Fecha de nacimiento",
    bloodType: "Tipo de sangre",
    curp: "CURP",
    localPhone: "Tél. local",
    maritalStatus: "Estado civil",
    nationality: "Nacionalidad",
    nss: "NSS",
    rfc: "RFC",
    rfcPostalCode: "Código postal RFC",
    sex: "Sexo",
    hasFonacotCredit: "Crédito FONACOT",
    fonacotCreditNumber: "No. crédito FONACOT",
    fonacotDiscountFactor: "FD o % descuento FONACOT",
    city: "Ciudad",
    district: "Colonia",
    townHall: "Municipio / Alcaldía",
    number: "Número",
    unitNumber: "Número interior",
    street: "Calle",
    zipCode: "Código postal",
    dateAdmission: "Fecha de ingreso",
    customerId: "Cliente",
    active: "Estatus",
    typePerson: "Contrato",
    salary: "Sueldo mensual neto",
    educationLevel: "Nivel educativo",
    numberEmployee: "Número de empleado",
  };

  form: FormGroup<EmployeeUnifiedProfileFormControls> = this.formB.group({
    firstName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    lastName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    phoneNumberPrefix: new FormControl("+52", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    phoneNumber: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    birth: new FormControl<Date | string | null>(null, {
      validators: [Validators.required],
    }),
    bloodType: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    curp: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    localPhone: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    maritalStatus: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    nationality: new FormControl<SelectItemDto | string | null>(null, {
      validators: [Validators.required],
    }),
    nss: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rfc: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rfcPostalCode: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    sex: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    hasInfonavitCredit: new FormControl(false, {
      nonNullable: true,
    }),
    infonavitCreditNumber: new FormControl("", {
      nonNullable: true,
    }),
    infonavitDiscountFactor: new FormControl("", {
      nonNullable: true,
    }),
    hasFonacotCredit: new FormControl(false, {
      nonNullable: true,
    }),
    fonacotCreditNumber: new FormControl("", {
      nonNullable: true,
    }),
    fonacotDiscountFactor: new FormControl("", {
      nonNullable: true,
    }),
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
    numberEmployee: new FormControl<number | null>(null, [
      Validators.min(1),
      Validators.max(9999),
    ]),
  });

  async ngOnInit(): Promise<void> {
    this.form.controls.salary.valueChanges.subscribe((val) => {
      this.form.controls.dailySalary.setValue(val ? val / 30.46 : null);
    });

    await this.onLoadCatalogs();
    await this.onLoadData();
  }

  private async onLoadCatalogs(): Promise<void> {
    const [
      bloodTypes,
      maritalStatuses,
      sexes,
      typeContracts,
      educationLevels,
    ] = await Promise.all([
      firstValueFrom(this.enumSelectS.bloodType()),
      firstValueFrom(this.enumSelectS.maritalStatus()),
      firstValueFrom(this.enumSelectS.sex()),
      firstValueFrom(this.enumSelectS.typeContract()),
      firstValueFrom(this.enumSelectS.educationLevel()),
    ]);

    this.cb_blood_type.set(bloodTypes);
    this.cb_marital_status.set(maritalStatuses);
    this.cb_sex.set(sexes);
    this.cb_type_contract.set(typeContracts);
    this.cb_education_level.set(educationLevels);
    this.cb_nationality.set(ECountry.GetEnum());

    const customers = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.customersActive,
    );
    this.cb_customer.set(customers ?? []);
  }

  private async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.EmployeeInternal.unifiedProfile(
        this.employeeId(),
        this.applicationUserId(),
      ),
    );

    if (!result) return;

    this.photoPath.set(result.photoPath);
    this.form.patchValue({
      firstName: result.firstName,
      lastName: result.lastName,
      phoneNumberPrefix: result.phoneNumberPrefix || "+52",
      phoneNumber: result.phoneNumber,
      email: result.email,
      birth: result.birth,
      bloodType: this.extractValue(result.bloodType),
      curp: result.curp,
      localPhone: result.localPhone,
      maritalStatus: this.extractValue(result.maritalStatus),
      nationality: this.findNationalityObject(result.nationality),
      nss: result.nss,
      rfc: result.rfc,
      rfcPostalCode: result.rfcPostalCode,
      sex: this.extractValue(result.sex),
      hasInfonavitCredit: result.hasInfonavitCredit === true,
      infonavitCreditNumber: result.infonavitCreditNumber ?? "",
      infonavitDiscountFactor: result.infonavitDiscountFactor ?? "",
      hasFonacotCredit: result.hasFonacotCredit === true,
      fonacotCreditNumber: result.fonacotCreditNumber ?? "",
      fonacotDiscountFactor: result.fonacotDiscountFactor ?? "",
      city: result.city,
      district: result.district,
      townHall: result.townHall,
      number: result.number,
      unitNumber: result.unitNumber,
      street: result.street,
      zipCode: result.zipCode,
      dateAdmission: result.dateAdmission,
      customerId: result.customerId,
      active: result.active === true || result.active === "true",
      typePerson: this.extractValue(result.typePerson),
      salary: result.salary,
      educationLevel: this.extractValue(result.educationLevel),
      numberEmployee: result.numberEmployee,
    });
  }

  changeImg(file: File): void {
    this.imgUpload.set(file);
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => this.imgTemp.set(reader.result);
    this.uploadImg(file);
  }

  private uploadImg(file: File): void {
    const formData = new FormData();
    formData.append("file", file);

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updateImage(this.applicationUserId()),
        formData,
      )
      .then((result: any) => {
        if (result) this.photoPath.set(result.photoPath);
      });
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) {
      this.invalidFields.set(this.getInvalidFieldLabels());
      this.scrollToInvalidSummary();
      return;
    }

    this.invalidFields.set([]);
    this.submitting.set(true);
    const payload = {
      ...this.form.getRawValue(),
      birth: this.dateS.getDateFormat(this.form.controls.birth.value),
      dateAdmission: this.dateS.getDateFormat(
        this.form.controls.dateAdmission.value,
      ),
      nationality: this.extractValue(this.form.controls.nationality.value),
    };

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updateUnifiedProfile(
          this.employeeId(),
          this.applicationUserId(),
        ),
        payload,
      )
      .then((result: any) => {
        this.submitting.set(false);
        if (result) this.onLoadData();
      });
  }

  canChangeCustomer(): boolean {
    return this.aspRoleS.hasAny([
      this.AspRole.SuperUsuario,
      this.AspRole.Reclutamiento,
    ]);
  }

  private extractValue(field: any): any {
    if (field === null || field === undefined) return null;
    return typeof field === "object" && field !== null ? field.value : field;
  }

  private findNationalityObject(nationality: any): SelectItemDto | null {
    if (!nationality) return null;
    if (typeof nationality === "object" && nationality.value) return nationality;

    return (
      this.cb_nationality().find(
        (item) => item.value === nationality || item.label === nationality,
      ) ?? null
    );
  }

  private getInvalidFieldLabels(): string[] {
    return Object.entries(this.form.controls)
      .filter(([, control]) => control.invalid)
      .map(([key]) => this.fieldLabels[key as keyof EmployeeUnifiedProfileFormControls])
      .filter((label): label is string => Boolean(label));
  }

  private scrollToInvalidSummary(): void {
    setTimeout(() => {
      document
        .querySelector(".employee-validation-summary")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}
