import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { CustomInputMaskSignal } from "@ui/inputs/web/custom-input-mask-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ICustomerForm } from "src/app/core/interfaces/customer-form.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { ICustomerAddOrEditDTO } from "../models/customer.dto";

interface ICustomerFormGroup {
  id: FormControl<string | null>;
  active: FormControl<boolean | null>;
  nameCustomer: FormControl<string>;
  nombreCorto: FormControl<string>;
  numeroCliente: FormControl<string>;
  phoneOne: FormControl<string | null>;
  phoneTwo: FormControl<string | null>;
  photoPath: FormControl<string | File | null>;
  register: FormControl<Date | string>;
  rfc: FormControl<string>;
  folioPrefix: FormControl<string | null>;
  adreess: FormControl<string>;
  latitud: FormControl<string>;
  longitud: FormControl<string>;
}

@Component({
  selector: "app-customer-form",
  templateUrl: "./customer-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputImg,
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
  optionActive: ISelectItem[] = [
    { value: true, label: "Activo" },
    { value: false, label: "Inactivo" },
  ];

  model: ICustomerForm;
  photoFileUpdate: boolean = false;

  form: FormGroup<ICustomerFormGroup> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    active: new FormControl<boolean | null>(null),
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
      .onGetItem<ICustomerAddOrEditDTO>(Endpoints.Customers.getById(this.id))
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
          this.form.getRawValue() as unknown as ICustomerForm,
        ),
    });
  }

  private createFormData(customerAdCustomerForm: ICustomerForm): FormData {
    const formData = new FormData();
    formData.append("active", String(customerAdCustomerForm.active));
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
