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
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputMaskSignal } from "@ui/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { provideFlatpickrDefaults } from "angularx-flatpickr";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ECountry } from "src/app/core/enums/paises.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { IEmployeePersonalDataForm } from "../models/employee-personal-data-form.interface";

@Component({
  selector: "app-employee-personal-data-form",
  templateUrl: "./employee-personal-data-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputDateSignal,
    CustomInputAutoComplete,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [provideFlatpickrDefaults()],
})
export class EmployeePersonalDataForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  enumSelectS = inject(EnumSelectService);
  employeeId = input<string>("");

  // Signals para ComboBoxes
  cb_blood_type = signal<ISelectItem[]>([]);
  cb_marital_status = signal<ISelectItem[]>([]);
  cb_nationality = signal<ISelectItem[]>([]);
  cb_sex = signal<ISelectItem[]>([]);

  submitting = signal(false);

  form: FormGroup<IEmployeePersonalDataForm> = this.formB.group({
    birth: new FormControl<Date | string>("", {
      validators: [Validators.required],
      nonNullable: true,
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
    nationality: new FormControl<ISelectItem | null>(null, {
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
    sex: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    await this.onLoadEnum();
    await this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.EmployeeInternal.personalData(this.employeeId()),
    );

    // Extraer valores de objetos si es necesario
    const formData = {
      birth: result.birth,
      bloodType: this.extractValue(result.bloodType),
      curp: result.curp,
      localPhone: result.localPhone,
      maritalStatus: this.extractValue(result.maritalStatus),
      nationality: this.findNationalityObject(result.nationality),
      nss: result.nss,
      rfc: result.rfc,
      sex: this.extractValue(result.sex),
    };

    this.form.patchValue(formData);
  }

  async onLoadEnum(): Promise<void> {
    this.cb_blood_type.set(await firstValueFrom(this.enumSelectS.bloodType()));
    this.cb_marital_status.set(
      await firstValueFrom(this.enumSelectS.maritalStatus()),
    );
    this.cb_nationality.set(ECountry.GetEnum());
    this.cb_sex.set(await firstValueFrom(this.enumSelectS.sex()));
  }

  extractValue(field: any): any {
    if (field === null || field === undefined) return null;
    return typeof field === "object" && field !== null ? field.value : field;
  }

  findNationalityObject(nationality: any): ISelectItem | null {
    if (!nationality) return null;

    // Si ya es un objeto con label y value
    if (typeof nationality === "object" && nationality.value) {
      return nationality;
    }

    // Si es un string, buscar en el array de nacionalidades
    const nationalityValue =
      typeof nationality === "string" ? nationality : null;
    if (nationalityValue) {
      const found = this.cb_nationality().find(
        (item) =>
          item.value === nationalityValue || item.label === nationalityValue,
      );
      return found || null;
    }

    return null;
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    // Construir payload limpio
    const payload = {
      birth: this.form.get("birth")?.value,
      bloodType: this.form.get("bloodType")?.value,
      curp: this.form.get("curp")?.value,
      localPhone: this.form.get("localPhone")?.value,
      maritalStatus: this.form.get("maritalStatus")?.value,
      nationality: this.extractValue(this.form.get("nationality")?.value),
      nss: this.form.get("nss")?.value,
      rfc: this.form.get("rfc")?.value,
      sex: this.form.get("sex")?.value,
    };

    this.apiResponseS
      .onPut(
        Endpoints.EmployeeInternal.updatePersonalData(this.employeeId()),
        payload,
      )
      .then((result: boolean) => {
        this.submitting.set(false);
        if (result) {
          // Recargar datos actualizados
          this.onLoadData();
        }
      });
  }
}
