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
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

interface IITaskMessageDTOCloseForm {
  id: FormControl<string | null>;
  closedDate: FormControl<string>;
  closedById: FormControl<string>;
  beforeWork: FormControl<File | null>;
  afterWork: FormControl<File | null>;
  beforeWorkPreview: FormControl<string>;
  afterWorkPreview: FormControl<string>;
  customerId: FormControl<string | null>;
}

@Component({
  selector: "app-task-close",
  templateUrl: "./task-close.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    CustomInputTextSignal,
    WebButtonLabelSave,
    CustomInputImg,
  ],
})
export class TaskClose implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private formB = inject(FormBuilder);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = this.config.data.id;
  submitting = signal(false);

  form: FormGroup<IITaskMessageDTOCloseForm> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    closedDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    closedById: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    beforeWork: new FormControl<File | null>(null),
    afterWork: new FormControl<File | null>(null),
    beforeWorkPreview: new FormControl("", { nonNullable: true }),
    afterWorkPreview: new FormControl("", { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      nonNullable: true,
    }),
  });

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getByClosed(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.controls.closedById.setValue(this.authS.applicationUserId);
        this.form.controls.customerId.setValue(this.customerIdS.customerId());

        // Si las imígenes existen, carga las vistas previas
        if (result.beforeWorkPreview) {
          this.form.controls.beforeWorkPreview.setValue(
            result.beforeWorkPreview,
          );
        }

        if (result.afterWorkPreview) {
          this.form.controls.afterWorkPreview.setValue(result.afterWorkPreview);
        }
      });
  }

  // Para manejar las imígenes 'BeforeWork' y 'AfterWork'
  onFileChange(event: any, fieldName: "beforeWork" | "afterWork") {
    const file = event.target.files[0];
    if (file) {
      this.form.controls[fieldName].setValue(file);

      // Crear una vista previa
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === "beforeWork")
          this.form.controls.beforeWorkPreview.setValue(
            reader.result as string,
          );
        if (fieldName === "afterWork")
          this.form.controls.afterWorkPreview.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Tasks.close,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue: any) => {
        const formData = new FormData();

        // Asegurar que el customerId sea el actual del servicio
        const customerId = this.customerIdS.customerId();

        Object.keys(formValue).forEach((key) => {
          const value = formValue[key];
          if (key === "closedDate") {
            if (value)
              formData.append(
                "closedDate",
                this.dateS.getDateFormat(value) ?? "",
              );
          } else if (key === "beforeWork" || key === "afterWork") {
            const file = value as File;
            if (file instanceof File) formData.append(key, file, file.name);
          } else if (key === "customerId") {
            formData.append("customerId", customerId || "");
          } else {
            formData.append(key, value != null ? value : "");
          }
        });

        // Backup por si no estaba en el formValue
        if (!formData.has("customerId") && customerId) {
          formData.append("customerId", customerId);
        }

        return formData;
      },
    };

    FormHelper.submitCrud(options);
  }
}
