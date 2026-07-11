import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EDocumentType } from "src/app/apps/legal.luxuryapp/asuntos-legales-y-seguros/models/document-type.enum";

@Component({
  selector: "app-templates-form",
  templateUrl: "./templates-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputFile,
    WebButtonLabelSave,
    ],
})
export class TemplatesForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  id: string = "";
  file: File | null = null;
  fileError: boolean = false;
  submitting = signal(false);

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    createdById: [this.authS.applicationUserId, [Validators.required]],
    name: ["", [Validators.required, Validators.maxLength(100)]],
    createAt: [new Date(), [Validators.required]],
    documentType: [EDocumentType.Template, [Validators.required]],
  });

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
  }

  onLoadData() {
    const urlApi = `customdocument/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const model = this.onCreateFormData(this.form.value);

    this.submitting.set(true);

    if (this.id === "") {
      this.apiResponseS
        .onPost(`customdocument`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`customdocument/${this.id}`, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  change(file: File) {
    this.file = file; // Asigna el archivo correctamente
  }

  onCreateFormData(form: any): FormData {
    const formData = new FormData();
    formData.append("customerId", this.customerIdS.customerId().toString());
    formData.append("name", form.name);
    formData.append("createdById", this.authS.applicationUserId);
    formData.append("documentType", form.documentType);
    formData.append("createAt", form.createAt.toISOString());

    if (this.file) {
      formData.append("document", this.file);
    }

    // Mostrar en consola convirtiendo a array
    console.log("=== FORM DATA VALUES ===");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    console.log("========================");

    return formData;
  }
}
