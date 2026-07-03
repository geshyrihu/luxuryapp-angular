import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button"; // Nueva importación
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

interface IPresentacionJuntaComiteForm {
  id: FormControl<string | null>;
  archivo: FormControl<File | null>;
  area: FormControl<string | null>;
}

@Component({
  selector: "app-presentacion-junta-comite-form",
  templateUrl: "./presentacion-junta-comite-form.html",
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
    WebButtonLabelSave,
    WebButtonLabel,
  ],
})
export class PresentacionJuntaComiteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private authS = inject(AuthService);
  private ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id: string = "";
  filePath: string = "";
  errorMessage: string = "";

  // Agregar signal para el nombre del archivo
  selectedFileName = signal<string>("");
  selectedFile: File | null = null;

  form: FormGroup<IPresentacionJuntaComiteForm> = this.formB.group({
    id: [""],
    archivo: [null as File | null],
    area: [""],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    this.form.patchValue({ area: this.config.data.titulo });
    this.form.controls.id.setValue(this.id);
  }

  onFileSelect(event: any) {
    const file = event.files[0];
    this.selectedFile = file;
    this.selectedFileName.set(file.name);
    // Aunque guardamos en selectedFile, tambión podemos ponerlo en el form si queremos validar required
    this.form.patchValue({ archivo: file });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    // Validación extra si archivo es requerido y no esté en form validators
    // El HTML usa !selectedFileName() para deshabilitar botún.

    this.id = this.config.data.id;
    const formValue = this.form.getRawValue();
    const model = this.onCreateFormData(formValue);

    this.submitting.set(true);

    this.apiResponseS
      .onPost(`PresentacionJuntaComite/AddFile`, model)
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  onCreateFormData(DTO: { area: string; archivo: File | null }) {
    let formData = new FormData();
    formData.append("id", String(this.id));
    formData.append("applicationUserId", this.authS.applicationUserId);
    formData.append("area", DTO.area);
    if (this.selectedFile) {
      formData.append("archivo", this.selectedFile);
    }
    return formData;
  }

  clearFile() {
    this.selectedFile = null;
    this.selectedFileName.set("");
    this.form.patchValue({ archivo: null });
  }
}
