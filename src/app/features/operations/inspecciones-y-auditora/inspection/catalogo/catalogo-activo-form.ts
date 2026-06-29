import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface ICatalogoActivoForm {
  id: FormControl<string>;
  folio: FormControl<string>;
  name: FormControl<string>;
  assetCategory: FormControl<number | null>;
}

@Component({
  selector: "app-catalogo-activo-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
  templateUrl: "./catalogo-activo-form.html",
})
export class CatalogoActivoForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  cb_category = signal<ISelectItem[]>([]);

  form: FormGroup<ICatalogoActivoForm> = new FormGroup({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    folio: new FormControl<string>("", {
      validators: [Validators.required, Validators.maxLength(5)],
      nonNullable: true,
    }),
    name: new FormControl<string>("", {
      validators: [Validators.required, Validators.maxLength(50)],
      nonNullable: true,
    }),
    assetCategory: new FormControl<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
    this.onLoadEnumSelectItem();
    this.form.controls.id.setValue(this.id);
  }
  onLoadData() {
    this.apiResponseS.onGetItem(Endpoints.CatalogAssets.getById(this.id)).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onLoadEnumSelectItem() {
    this.apiResponseS
      .onGetEnumSelectItem(Endpoints.EnumSelectItems.assetCategory)
      .then((result: any) => {
        this.cb_category.set(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CatalogAssets.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}

