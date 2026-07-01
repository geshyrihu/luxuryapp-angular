import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface ICatalogoRevisionesInspeccionForm {
  id: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-catalogo-revisiones-inspeccion-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabelSave,
    CardModule,
  ],
  templateUrl: "./catalogo-revisiones-inspeccion-form.html",
})
export class CatalogoRevisionesInspeccionForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  form: FormGroup<ICatalogoRevisionesInspeccionForm> = new FormGroup({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    description: new FormControl<string>("", {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
    this.form.controls.id.setValue(this.id);
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.InspectionReviewCatalog.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.InspectionReviewCatalog.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
