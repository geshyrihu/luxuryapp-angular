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
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputImg,
    CustomInputSelectSignal,
    InputAutocomplete,
    WebButtonLabelSave,
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
  readonly cb_category = signal<SelectItemDto[]>([]);
  readonly cb_clasificacion = signal<SelectItemDto[]>([]);

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
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.categories,
      ),
      firstValueFrom(this.enumSelectS.productClasificacion()),
    ]);

    // Actualización de signals (evita NG0100 al ser asíncrono tras await)
    this.cb_category.set(categories as SelectItemDto[]);
    this.cb_clasificacion.set(clasificacion);

    if (this.id()) {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Products.getById(this.id()),
    );

    if (!result) return;

    this.urlBaseImg = result.urlImagen || "";

    // Extraer categoryId
    const categoryId =
      typeof result.categoryId === "object"
        ? result.categoryId.value
        : result.categoryId;

    // Buscar la categoróa completa usando el signal actual
    const selectedCategory = this.cb_category().find(
      (item) => item.value === categoryId,
    );

    this.form.patchValue({
      ...result,
      categoryId,
      category: selectedCategory || null,
    });
  }

  public savecategoryId = (item: SelectItemDto) => {
    this.form.patchValue({
      categoryId: item?.value,
      category: item?.label,
    });
  };

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id() === "" ? `productos` : `productos/${this.id()}`,
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
