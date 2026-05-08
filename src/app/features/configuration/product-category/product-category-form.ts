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
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface IProductCategoryForm {
  id: FormControl<string | null>;
  nameCotegory: FormControl<string>;
  user: FormControl<string | null>;
}

@Component({
  selector: "app-product-category-form",
  templateUrl: "./product-category-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomButtonSave,
    CardModule,
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
        Validators.maxLength(30),
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
    const urlApi = `Categories/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (!this.id) {
      this.apiResponseS
        .onPost(`Categories`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`Categories/${this.id}`, this.form.value)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}









