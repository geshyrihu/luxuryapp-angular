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
;
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface IProductCategoryForm {
  id: FormControl<string | null>;
  nameCotegory: FormControl<string>;
  user: FormControl<string | null>;
}

@Component({
  selector: "app-product-category-form",
  templateUrl: "./product-category-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    WebButtonLabelSave
  ],
})
export class ProductCategoryForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";
  form: FormGroup<IProductCategoryForm> = this.formB.group({
    id: new FormControl({ value: this.id, disabled: true }),
    nameCotegory: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ],
      nonNullable: true,
    }),
    user: new FormControl<string | null>(""),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
    }
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.ProductCategories.getById(this.id))
      .then((result: any) => {
        if (result) {
          this.form.patchValue(result);
        }
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.ProductCategories.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
