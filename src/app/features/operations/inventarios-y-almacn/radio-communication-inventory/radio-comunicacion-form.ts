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
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { IRadioComunicacionForm } from "src/app/core/interfaces/radio-comunicacion-form.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { DateService } from "src/app/core/services/date.service";

interface IRadioComunicacionFormGroup {
  id: FormControl<string>;
  marca: FormControl<string>;
  fotografia: FormControl<string | File>;
  modelo: FormControl<string>;
  serie: FormControl<string>;
  fechaCompra: FormControl<string>;
  customerId: FormControl<string | null>;
  bateria: FormControl<string>;
  departament: FormControl<string>;
  applicationUserId: FormControl<string | null>;
  applicationUser: FormControl<string | null>;
}
@Component({
  selector: "app-radio-comunicacion-form",
  templateUrl: "./radio-comunicacion-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    InputAutocomplete,
    InputImg,
    WebButtonLabelSave,
  ],
})
export class RadioComunicacionForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  dateS = inject(DateService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);
  id: string = "";

  urlBaseImg = "";
  photoFileUpdate: boolean = false;

  // Signals para ComboBoxes
  cb_application_user = signal<ISelectItem[]>([]);
  cb_departament = signal<ISelectItem[]>([]);

  form: FormGroup<IRadioComunicacionFormGroup> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    marca: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fotografia: new FormControl<string | File>("", { nonNullable: true }),
    modelo: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    serie: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    fechaCompra: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId()),
    bateria: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    departament: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string | null>(null),
    applicationUser: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onLoadSelectItem();

    if (this.id) {
      await this.onLoadData();
    }
  }

  async onLoadSelectItem(): Promise<void> {
    const [applicationUsers, departaments] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.applicationUsersByCustomer(
          this.customerIdS.customerId(),
        ),
      ),
      this.apiResponseS.onGetEnumSelectItem(
        Endpoints.EnumSelectItems.departament,
      ),
    ]);

    this.cb_application_user.set(applicationUsers as ISelectItem[]);
    this.cb_departament.set(departaments as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: IRadioComunicacionForm = await this.apiResponseS.onGetItem(
      Endpoints.RadioCommunication.getById(this.id),
    );

    // Extraer applicationUserId con manejo seguro de null
    let applicationUserId = null;
    if (
      result.applicationUserId !== null &&
      result.applicationUserId !== undefined
    ) {
      applicationUserId =
        typeof result.applicationUserId === "object" &&
        result.applicationUserId !== null
          ? (result.applicationUserId as any).value
          : result.applicationUserId;
    }

    // Buscar el usuario completo
    const selectedUser = applicationUserId
      ? this.cb_application_user().find(
          (item) => item.value === applicationUserId,
        )
      : null;

    this.form.patchValue({
      ...result,
      fechaCompra: this.dateS.getDateFormat(result.fechaCompra),
      departament: String(result.departament),
      applicationUserId,
      applicationUser: selectedUser ? selectedUser.label : null,
    });

    this.urlBaseImg = result.fotografia || "";
  }

  saveApplicationUserId = (item: any) => {
    this.form.patchValue({
      applicationUserId: item?.value,
      applicationUser: item?.label,
    });
  };

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ fotografia: file });
  }

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        this.id === ""
          ? Endpoints.RadioCommunication.create
          : Endpoints.RadioCommunication.update(this.id),
      method: this.id === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (val) => this.createFormData(val),
    });
  }

  private createFormData(DTO: any): FormData {
    const formData = new FormData();

    formData.append("marca", DTO.marca);
    formData.append("modelo", DTO.modelo);
    formData.append("serie", DTO.serie);
    formData.append("fechaCompra", this.dateS.getDateFormat(DTO.fechaCompra));
    formData.append("bateria", DTO.bateria);
    formData.append("departament", String(DTO.departament));

    // CustomerId
    const customerId =
      this.id === "" ? this.customerIdS.customerId() : DTO.customerId;
    formData.append("customerId", String(customerId));

    // ApplicationUserId (opcional)
    if (DTO.applicationUserId != null) {
      formData.append("applicationUserId", String(DTO.applicationUserId));
    }

    // Fotografóa (opcional)
    if (DTO.fotografia) {
      formData.append("fotografia", DTO.fotografia);
    }

    return formData;
  }
}
