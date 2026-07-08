import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { LxCard } from "@ui/adaptive/card/card";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface IMeterCategoryForm {
  id: FormControl<string | null>;
  nombreMedidorCategoria: FormControl<string>;
}

@Component({
  selector: "app-meter-category-form",
  templateUrl: "./meter-category-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    LxCard,
    WebButtonLabelSave,
  ],
})
export class MeterCategoryForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  id: string = "";

  form: FormGroup<IMeterCategoryForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    nombreMedidorCategoria: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();

    // Sync Id
    this.form.controls.id.setValue(this.id);
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.MeterCategories.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.MeterCategories.getAll,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    };
    FormHelper.submitCrud(options);
  }
}
