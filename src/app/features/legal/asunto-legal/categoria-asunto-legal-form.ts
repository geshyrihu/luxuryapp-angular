import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-categoria-asunto-legal-form",
  templateUrl: "./categoria-asunto-legal-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomButtonSave,
  ],
})
export class CategoriaAsuntoLegalForm {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    name: ["", [Validators.required, Validators.maxLength(100)]],
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sync id to form control if needed for getRawValue, though it is disabled.
    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.LegalMatters.categoryById(this.id))
      .then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.LegalMatters.createCategory,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}









