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
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    InputMask,
    InputAutocomplete,
    WebButtonLabelSave,
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
  cb_properties = signal<SelectItemDto[]>([]);
  cb_Habitant = signal<SelectItemDto[]>([]);

  cb_enviarMails: SelectItemDto[] = [
    {
      label: "Sí",
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
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        `properties/${this.customerIdS.customerId()}`,
      ),
      firstValueFrom(this.enumSelectS.typeHabitant()),
    ]);

    this.cb_properties.set(properties as SelectItemDto[]);
    this.cb_Habitant.set(habitants);
  }

  async getImem(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Owner.getById(this.id),
    );

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

  savePropiedadId = (item: SelectItemDto) => {
    this.form.patchValue({
      propertyId: item?.value,
      property: item?.label,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "owner",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const f = this.form.value;
        return {
          customerId: f.customerId,
          phoneNumber: f.phoneNumber,
          propertyId: f.propertyId,
          extencion: f.extencion,
          fixedPhone: f.fixedPhone,
          habitant: f.habitant,
          email: f.email,
          firstName: f.firstName,
          lastName: f.lastName,
          enviarMails: f.enviarMails,
        };
      },
    });
  }
}
