import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Component({
  selector: "app-add-file-estado-financiero",
  templateUrl: "./add-file-estado-financiero.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputFile, WebButtonLabelSave],
})
export class AddFileEstadoFinanciero implements OnInit {
  formB = inject(FormBuilder);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id: string = "";
  filePath: string = "";

  form: FormGroup = this.formB.group({
    nameFileEstadoFinanciero: [""],
  });
  ngOnInit(): void {
    this.id = this.config.data.id;
  }

  change(file: File) {
    this.form.patchValue({ nameFileEstadoFinanciero: file });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.id = this.config.data.id;
    const model = this.onCreateFormData(this.form.value);

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        Endpoints.RefactorContabilidad.financialReportUploadFileByIdById(
          this.id,
          this.authS.applicationUserId,
        ),
        model,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  onCreateFormData(DTO: any) {
    let formData = new FormData();
    if (DTO.nameFileEstadoFinanciero) {
      formData.append("nameFileEstadoFinanciero", DTO.nameFileEstadoFinanciero);
    }
    return formData;
  }
}
