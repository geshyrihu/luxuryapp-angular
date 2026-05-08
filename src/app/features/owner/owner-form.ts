import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IOwnerForm {
  id: FormControl<string | null>;
  customerId: FormControl<string | null>;
  phoneNumber: FormControl<string>;
  propertyId: FormControl<number | null>;
  property: FormControl<string | null>;
  extencion: FormControl<string | null>;
  fixedPhone: FormControl<string | null>;
  habitant: FormControl<number | null>;
  email: FormControl<string | null>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  enviarMails: FormControl<boolean | null>;
}

@Component({
  selector: "app-owner-form",
  templateUrl: "./owner-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputMaskSignal,
    CustomInputAutoComplete,
    CustomButtonSave,
  ],
})
export class OwnerForm implements OnInit {
  enumSelectS = inject(EnumSelectService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_properties = signal<ISelectItem[]>([]);
  cb_Habitant = signal<ISelectItem[]>([]);

  cb_enviarMails: ISelectItem[] = [
    {
      label: "Só",
      value: true,
    },
    {
      label: "No",
      value: false,
    },
  ];

  form: FormGroup<IOwnerForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId()),
    phoneNumber: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    propertyId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    property: new FormControl<string | null>(null),
    extencion: new FormControl(""),
    fixedPhone: new FormControl(""),
    habitant: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    email: new FormControl(""),
    firstName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    lastName: new FormControl("", {
      validators: [Validators.required],
      nonNullable: true,
    }),
    enviarMails: new FormControl(true),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onLoadSelectItems();

    if (this.id) {
      await this.getImem();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [properties, habitants] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        `properties/${this.customerIdS.customerId()}`,
      ),
      firstValueFrom(this.enumSelectS.typeHabitant()),
    ]);

    this.cb_properties.set(properties as ISelectItem[]);
    this.cb_Habitant.set(habitants);
  }

  async getImem(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(`owner/${this.id}`);

    // Extraer propertyId
    const propertyId =
      typeof result.propertyId === "object"
        ? result.propertyId.value
        : result.propertyId;

    // Buscar la propiedad completa
    const selectedProperty = this.cb_properties().find(
      (item) => item.value === propertyId,
    );

    this.form.patchValue({
      ...result,
      propertyId,
      property: selectedProperty || null,
    });
  }

  savePropiedadId = (item: ISelectItem) => {
    this.form.patchValue({
      propertyId: item?.value,
      property: item?.label,
    });
  };

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    // Construir payload limpio
    const payload = {
      customerId: this.form.get("customerId")?.value,
      phoneNumber: this.form.get("phoneNumber")?.value,
      propertyId: this.form.get("propertyId")?.value,
      extencion: this.form.get("extencion")?.value,
      fixedPhone: this.form.get("fixedPhone")?.value,
      habitant: this.form.get("habitant")?.value,
      email: this.form.get("email")?.value,
      firstName: this.form.get("firstName")?.value,
      lastName: this.form.get("lastName")?.value,
      enviarMails: this.form.get("enviarMails")?.value,
    };

    const request =
      this.id === ""
        ? this.apiResponseS.onPost(`owner`, payload)
        : this.apiResponseS.onPut(`owner/${this.id}`, payload);

    request.then((result: boolean) => {
      result ? this.ref.close(true) : this.submitting.set(false);
    });
  }
}
