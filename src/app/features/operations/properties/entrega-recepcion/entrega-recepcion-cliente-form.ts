import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-entrega-recepcion-cliente-form",
  templateUrl: "./entrega-recepcion-cliente-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputFile,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class EntregaRecepcionClienteForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);

  id: string = "";
  cb_estatus = signal<ISelectItem[]>([]);
  submitting = signal(false);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    observaciones: new FormControl<string>(""),
    archivo: new FormControl<any>(null),
    estatus: new FormControl<number>(0, Validators.required),
  });

  async ngOnInit() {
    this.cb_estatus.set(await firstValueFrom(this.enumSelectS.state()));
    this.id = this.config.data.id;
    this.form.patchValue({ id: this.id });
    this.onLoadData();
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const model = this.onCreateFormData(this.form.getRawValue());
    this.submitting.set(true);

    this.apiResponseS
      .onPut(
        Endpoints.EntregaRecepcion.updateClient(
          this.id,
          this.authS.applicationUserId,
          this.customerIdS.customerId(),
        ),
        model,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.EntregaRecepcion.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  change(file: File) {
    this.form.patchValue({ archivo: file });
  }

  onCreateFormData(DTO: any) {
    let formData = new FormData();
    formData.append("id", String(this.id));
    formData.append("estatus", String(DTO.estatus));
    formData.append("userId", this.authS.applicationUserId); // Corregido: DTO.userId no existe en el form
    formData.append("observaciones", String(DTO.observaciones));
    if (DTO.archivo) {
      formData.append("archivo", DTO.archivo);
    }
    return formData;
  }
}
