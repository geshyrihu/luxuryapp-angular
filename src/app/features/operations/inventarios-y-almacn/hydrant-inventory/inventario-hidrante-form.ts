import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IInventarioHidranteForm {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  hydrantType: FormControl<number | null>;
  cabinetNumber: FormControl<string | null>;
  location: FormControl<string>;
  localCode: FormControl<string>;
  photo: FormControl<string | File>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-inventario-hidrante-form",
  templateUrl: "./inventario-hidrante-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputSelectSignal,
    CustomInputImg,
    WebButtonLabelSave,
  ],
})
export class InventarioHidranteForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  submitting = signal(false);

  cb_hydrantType: ISelectItem[] = [];
  photoFileUpdate = false;
  urlBaseImg = "";
  id = "";

  form: FormGroup<IInventarioHidranteForm> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    hydrantType: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    cabinetNumber: new FormControl<string | null>(null),
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
    this.cb_hydrantType = await firstValueFrom(this.enumSelectS.hydrantType());
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
    } else {
      this.form.patchValue({ localCode: "HID-" });
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`InventarioHidrante/${this.id}`)
      .then((result: any) => {
        this.urlBaseImg = result.currentPhoto;
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.getRawValue());
    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost("InventarioHidrante", formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`InventarioHidrante/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    formData.append("customerId", String(DTO.customerId));
    formData.append("hydrantType", String(DTO.hydrantType));
    formData.append("location", String(DTO.location));
    if (DTO.cabinetNumber)
      formData.append("cabinetNumber", String(DTO.cabinetNumber));
    formData.append("localCode", String(DTO.localCode));
    formData.append("applicationUserId", String(DTO.applicationUserId));
    if (DTO.photo) formData.append("photo", DTO.photo);
    return formData;
  }
}
