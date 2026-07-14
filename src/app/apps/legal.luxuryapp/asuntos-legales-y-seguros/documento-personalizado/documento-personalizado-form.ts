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
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

interface IDocumentoPersonalizadoForm {
  id: FormControl<string>;
  createdById: FormControl<string>;
  name: FormControl<string>;
  createAt: FormControl<Date>;
  documentType: FormControl<number>;
}

@Component({
  selector: "app-documento-personalizado-form",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputFile,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./documento-personalizado-form.html",
})
export class DocumentoPersonalizadoForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  file: File | null = null;
  fileError: boolean = false;
  submitting = signal(false);

  form: FormGroup<IDocumentoPersonalizadoForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }, { nonNullable: true }),
    createdById: new FormControl(this.authS.applicationUserId, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    name: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
    createAt: new FormControl(new Date(), {
      validators: [Validators.required],
      nonNullable: true,
    }),
    documentType: new FormControl<number>(this.config.data.documentType, {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sincronizar ID
    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.CustomDocuments.getById(this.id))
      .then((result: any) => {
        this.form.patchValue({
          id: result.id,
          name: result.name,
          createAt: this.dateS.parseDate(result.createAt) ?? new Date(),
        });
      });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    // Validación para creación: archivo es obligatorio
    if (this.id === "" && !this.file) {
      this.fileError = true;
      return;
    }

    this.fileError = false;

    const rawValue = this.form.getRawValue();
    const model = this.onCreateFormData(rawValue);

    this.submitting.set(true);

    if (this.id === "") {
      this.apiResponseS
        .onPost(Endpoints.CustomDocuments.create, model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.CustomDocuments.update(this.id), model)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  change(file: File) {
    this.file = file;
    this.fileError = false;
  }

  onCreateFormData(
    formValues: ReturnType<typeof this.form.getRawValue>,
  ): FormData {
    const formData = new FormData();
    formData.append("customerId", this.customerIdS.customerId().toString());
    formData.append("name", formValues.name);
    formData.append("createdById", this.authS.applicationUserId);
    formData.append("documentType", formValues.documentType.toString());
    formData.append("createAt", this.dateS.getDateFormat(formValues.createAt));

    if (this.file) formData.append("document", this.file);

    return formData;
  }
}
