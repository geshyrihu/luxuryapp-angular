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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IInventarioExtintorForm {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  extinguisherType: FormControl<number | null>;
  expirationDate: FormControl<string | null>;
  location: FormControl<string>;
  localCode: FormControl<string>;
  photo: FormControl<string | File>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-inventario-extintor",
  templateUrl: "./inventario-extintor-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputMask,
    CustomInputSelectSignal,
    InputImg,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
})
export class InventarioExtintorForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  dateS = inject(DateService);
  submitting = signal(false);

  cb_extintor: SelectItemDto[] = [];
  photoFileUpdate: boolean = false;
  urlBaseImg: string = "";
  id: string = "";

  form: FormGroup<IInventarioExtintorForm> = this.formB.group({
    id: new FormControl(this.id, { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    extinguisherType: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    expirationDate: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    location: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    localCode: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    photo: new FormControl<string | File>("", { nonNullable: true }),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId,
    ),
  });

  uploadFile(file: any) {
    this.photoFileUpdate = true;
    this.form.patchValue({ photo: file });
  }

  async ngOnInit() {
    this.cb_extintor = await firstValueFrom(
      this.enumSelectS.extinguisherType(),
    );
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
    } else {
      this.form.patchValue({ localCode: "EXT-" });
    }
  }
  onLoadData() {
    const urlApi = Endpoints.FireExtinguishers.getById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.urlBaseImg = result.currentPhoto;
      this.form.patchValue({
        ...result,
        expirationDate: new Date(result.expirationDate),
      });
    });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.getRawValue());

    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(Endpoints.FireExtinguishers.create, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          Endpoints.FireExtinguishers.update(this.id),
          formData,
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    formData.append("customerId", String(DTO.customerId));
    formData.append("extinguisherType", String(DTO.extinguisherType));
    formData.append(
      "expirationDate",
      this.dateS.getDateFormat(DTO.expirationDate),
    );
    formData.append("location", String(DTO.location));
    formData.append("localCode", String(DTO.localCode));
    formData.append("applicationUserId", String(DTO.applicationUserId));
    if (DTO.photo) {
      formData.append("photo", DTO.photo);
    }
    return formData;
  }
}
