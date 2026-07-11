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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { CatalogoActivoFormGroup } from "./interfaces/catalogo-activo-form.interface";

@Component({
  selector: "app-catalogo-activo-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
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

  form: FormGroup<CatalogoActivoFormGroup> = new FormGroup({
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
    this.apiResponseS
      .onGetItem(Endpoints.CatalogAssets.getById(this.id))
      .then((result: any) => {
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
