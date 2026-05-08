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
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IInventarioExtintorForm {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  eExtintor: FormControl<number | null>;
  ubicacion: FormControl<string>;
  photo: FormControl<string | File>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-inventario-extintor-form",
  templateUrl: "./inventario-extintor-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputImg,
    CustomButtonSave,
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
  submitting = signal(false);

  cb_extintor: ISelectItem[] = [];
  photoFileUpdate: boolean = false;
  urlBaseImg: string = "";
  id: string = "";

  form: FormGroup<IInventarioExtintorForm> = this.formB.group({
    id: new FormControl(this.id, { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    eExtintor: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    ubicacion: new FormControl("", {
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
    this.cb_extintor = await firstValueFrom(this.enumSelectS.extintor());
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `InventarioExtintor/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
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
        .onPost(`InventarioExtintor`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`InventarioExtintor/${this.id}`, formData)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    formData.append("customerId", String(DTO.customerId));
    formData.append("eExtintor", String(DTO.eExtintor));
    formData.append("ubicacion", String(DTO.ubicacion));
    formData.append("applicationUserId", String(DTO.applicationUserId));
    // ... Si hay un archivo cargado agrega la prop photoPath con su valor
    if (DTO.photo) {
      formData.append("photo", DTO.photo);
    }
    return formData;
  }
}
