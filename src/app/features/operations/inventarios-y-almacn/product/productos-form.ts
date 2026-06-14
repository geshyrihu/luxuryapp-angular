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
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

interface IProductosForm {
  id: FormControl<string | null>;
  category: FormControl<string | null>;
  categoryId: FormControl<number | string | null>;
  clasificacion: FormControl<number | null>;
  applicationUserId: FormControl<string | null>;
  marca: FormControl<string | null>;
  modelo: FormControl<string | null>;
  nombreProducto: FormControl<string>;
  urlImagen: FormControl<string | File | null>;
  imagen: FormControl<File | null>;
}

@Component({
  selector: "app-productos-form",
  templateUrl: "./productos-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputImg,
    CustomInputSelectSignal,
    CustomInputAutoComplete,
    CustomButtonSave,
  ],
})
export class ProductosForm implements OnInit {
  // Servicios
  private readonly authS = inject(AuthService);
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly formB = inject(FormBuilder);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly enumSelectS = inject(EnumSelectService);

  // Signals de estado
  readonly id = signal<string>("");
  readonly submitting = signal(false);
  readonly cb_category = signal<ISelectItem[]>([]);
  readonly cb_clasificacion = signal<ISelectItem[]>([]);

  // URL base para imagen (podría ser signal si cambia reactivamente)
  urlBaseImg = "";
  selectedFile: File | null = null;

  // Formulario reactivo
  readonly form: FormGroup<IProductosForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    category: new FormControl<string | null>(null),
    categoryId: new FormControl<number | string | null>("", {
      validators: [Validators.required],
    }),
    clasificacion: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId,
    ),
    marca: new FormControl<string | null>(""),
    modelo: new FormControl<string | null>(""),
    nombreProducto: new FormControl("", {
      validators: [
        Validators.required,
        Validators.maxLength(45),
        Validators.minLength(5),
      ],
      nonNullable: true,
    }),
    urlImagen: new FormControl<string | File | null>(""),
    imagen: new FormControl<File | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id.set(this.config.data?.id || "");

    // Carga de catálogos en paralelo
    const [categories, clasificacion] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("Categories"),
      firstValueFrom(this.enumSelectS.productClasificacion()),
    ]);

    // Actualización de signals (evita NG0100 al ser asíncrono tras await)
    this.cb_category.set(categories as ISelectItem[]);
    this.cb_clasificacion.set(clasificacion);

    if (this.id()) {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `Productos/${this.id()}`,
    );

    if (!result) return;

    this.urlBaseImg = result.urlImagen || "";

    // Extraer categoryId
    const categoryId =
      typeof result.categoryId === "object"
        ? result.categoryId.value
        : result.categoryId;

    // Buscar la categoría completa usando el signal actual
    const selectedCategory = this.cb_category().find(
      (item) => item.value === categoryId,
    );

    this.form.patchValue({
      ...result,
      categoryId,
      category: selectedCategory || null,
    });
  }

  public savecategoryId = (item: ISelectItem) => {
    this.form.patchValue({
      categoryId: item?.value,
      category: item?.label,
    });
  };

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id() === "" ? `Productos` : `Productos/${this.id()}`,
      method: this.id() === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.createFormData(),
    });
  }

  private createFormData(): FormData {
    const formValues = this.form.getRawValue();
    const formData = new FormData();

    formData.append("nombreProducto", formValues.nombreProducto);
    formData.append("categoryId", String(formValues.categoryId));
    formData.append("marca", formValues.marca || "");
    formData.append("modelo", formValues.modelo || "");
    formData.append("clasificacion", String(formValues.clasificacion));
    formData.append("applicationUserId", formValues.applicationUserId);

    const imagenControl = this.form.get("imagen");
    const imagenFile = imagenControl?.value;

    if (imagenFile instanceof File) {
      formData.append("urlImagen", imagenFile);
    }

    return formData;
  }
}
