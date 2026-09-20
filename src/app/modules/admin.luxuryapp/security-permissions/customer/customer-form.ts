import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomerFormDto } from "@core/interfaces/customer-form.interface";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { CustomerAddOrEditDto } from "./interfaces/customer-add-or-edit.dto";
import { CustomerFormGroup } from "./interfaces/customer-form.interface";

@Component({
  selector: "app-customer-form",
  templateUrl: "./customer-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputMask,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    InputImg,
    WebButtonLabelSave,
  ],
})
export class CustomerForm implements OnInit {
  formB = inject(FormBuilder);
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  optionActive: SelectItemDto[] = [
    { value: true, label: "Activo" },
    { value: false, label: "Inactivo" },
  ];

  /** Entidades federativas (espejo de MexicanStateEnum del backend). */
  stateOptions: SelectItemDto[] = [
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Ciudad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Estado de México",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas",
  ].map((label, index) => ({ value: index, label }));

  model: CustomerFormDto;
  photoFileUpdate: boolean = false;

  form: FormGroup<CustomerFormGroup> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    active: new FormControl<boolean | null>(null),
    state: new FormControl<number | null>(6),
    nameCustomer: new FormControl("", {
      validators: [Validators.required, Validators.minLength(5)],
      nonNullable: true,
    }),
    nombreCorto: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    numeroCliente: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    phoneOne: new FormControl<string | null>(null),
    phoneTwo: new FormControl<string | null>(null),
    photoPath: new FormControl<string | File | null>(null),
    register: new FormControl<Date | string>(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    rfc: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    folioPrefix: new FormControl<string | null>("", {
      validators: [Validators.maxLength(5)],
    }),
    adreess: new FormControl("", { nonNullable: true }),
    latitud: new FormControl("", { nonNullable: true }),
    longitud: new FormControl("", { nonNullable: true }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photoPath: file });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CustomerAddOrEditDto>(Endpoints.Customers.getById(this.id))
      .then((result) => {
        if (result) {
          this.model = result as any;
          const register = this.dateS.getDateFormat(result.register as any);
          this.model.register = register as any;
          this.form.patchValue(result as any);
        }
      });
  }

  async onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: !this.id
        ? Endpoints.Customers.create
        : Endpoints.Customers.update(this.id),
      method: !this.id ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () =>
        this.createFormData(
          this.form.getRawValue() as unknown as CustomerFormDto,
        ),
    });
  }

  private createFormData(customerAdCustomerForm: CustomerFormDto): FormData {
    const formData = new FormData();
    formData.append("active", String(customerAdCustomerForm.active));
    formData.append("state", String(customerAdCustomerForm.state));
    formData.append("adreess", customerAdCustomerForm.adreess);
    formData.append("folioPrefix", customerAdCustomerForm.folioPrefix);
    formData.append("nameCustomer", customerAdCustomerForm.nameCustomer);
    formData.append("nombreCorto", customerAdCustomerForm.nombreCorto);
    formData.append("phoneOne", customerAdCustomerForm.phoneOne);
    formData.append("phoneTwo", customerAdCustomerForm.phoneTwo);
    formData.append("longitud", customerAdCustomerForm.longitud);
    formData.append("latitud", customerAdCustomerForm.latitud);
    if (customerAdCustomerForm.photoPath) {
      formData.append("photoPath", customerAdCustomerForm.photoPath);
    }
    formData.append(
      "register",
      this.dateS.getDateFormat(customerAdCustomerForm.register),
    );
    formData.append("rfc", customerAdCustomerForm.rfc);
    formData.append("numeroCliente", customerAdCustomerForm.numeroCliente);
    return formData;
  }
}

