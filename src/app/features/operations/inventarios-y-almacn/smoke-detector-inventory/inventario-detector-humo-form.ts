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
import { CustomInputImg } from "@ui/inputs/web/custom-input-img-signal";
import { CustomInputMaskSignal } from "@ui/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IInventarioDetectorHumoForm {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  detectorType: FormControl<number | null>;
  location: FormControl<string>;
  localCode: FormControl<string>;
  photo: FormControl<string | File>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-inventario-detector-humo-form",
  templateUrl: "./inventario-detector-humo-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class InventarioDetectorHumoForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  submitting = signal(false);

  cb_detectorType: ISelectItem[] = [];
  photoFileUpdate = false;
  urlBaseImg = "";
  id = "";

  form: FormGroup<IInventarioDetectorHumoForm> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    detectorType: new FormControl<number | null>(null, {
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
    this.cb_detectorType = await firstValueFrom(
      this.enumSelectS.smokeDetectorType(),
    );
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
    } else {
      this.form.patchValue({ localCode: "DET-" });
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`InventarioDetectorHumo/${this.id}`)
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
        .onPost("InventarioDetectorHumo", formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`InventarioDetectorHumo/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    formData.append("customerId", String(DTO.customerId));
    formData.append("detectorType", String(DTO.detectorType));
    formData.append("location", String(DTO.location));
    formData.append("localCode", String(DTO.localCode));
    formData.append("applicationUserId", String(DTO.applicationUserId));
    if (DTO.photo) formData.append("photo", DTO.photo);
    return formData;
  }
}
