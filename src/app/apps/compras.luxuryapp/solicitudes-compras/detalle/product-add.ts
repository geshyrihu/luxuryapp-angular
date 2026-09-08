import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ProductModalAdd } from "./product-modal-add";

interface IProductSuggestion {
  productoId: string;
  producto: string;
  marca: string;
  urlImagen: string;
  cantidad: number;
  unidadMedidaId: string;
  displayName: string;
}

@Component({
  selector: "app-product-add",
  templateUrl: "./product-add.html",
  styles: [
    `
      :host ::ng-deep .product-search-panel {
        width: 28rem;
        max-width: 28rem;
      }

      :host ::ng-deep .product-search-panel .p-autocomplete-list {
        padding-block: 0.25rem;
      }

      :host ::ng-deep .product-search-option {
        min-height: 8.5rem;
        padding: 0.75rem 0.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabel,
    WebButtonLabelSave,
    InputAutocomplete,
    CustomInputSelectSignal,
    CustomInputTextSignal,
  ],
})
export class ProductAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  private dialogHandlerS = inject(DialogHandlerService);

  solicitudCompraId = input<string>("");
  updateData = output<void>();

  cb_measurement_units = signal<SelectItemDto[]>([]);
  products = signal<IProductSuggestion[]>([]);

  productSearchControl = new FormControl<IProductSuggestion | string | null>(
    null,
  );

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    productoId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    productName: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cantidad: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unidadMedidaId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    solicitudCompraId: new FormControl<string | null>(null),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId),
  });

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.onLoadMeasurementUnits();
  }

  async onLoadMeasurementUnits(): Promise<void> {
    const result: any = await this.apiResponseS.onGetSelectItem<
      SelectItemDto[]
    >(Endpoints.SelectItems.measurementUnits);
    this.cb_measurement_units.set(result as SelectItemDto[]);
  }

  onLoadProduct(param: string) {
    this.apiResponseS
      .onGetListNotLoading(
        Endpoints.PurchaseRequestDetails.searchToAdd(this.solicitudCompraId()),
        {
          param: param,
        },
      )
      .then((result: any) => {
        const mapped = Array.isArray(result)
          ? result.map((item) => ({
              ...item,
              displayName:
                `${item?.marca ?? ""} ${item?.producto ?? ""}`.trim(),
            }))
          : [];
        this.products.set(mapped);
      });
  }

  searchProducts(event: { query: string }): void {
    const query = event.query?.trim() ?? "";
    this.form.patchValue({
      productName: query,
      productoId: null,
    });

    if (query.length >= 2) {
      this.onLoadProduct(query);
      return;
    }

    this.products.set([]);
  }

  onProductSelected(
    event: IProductSuggestion | { value: IProductSuggestion },
  ): void {
    const selected = "value" in event ? event.value : event;
    this.form.patchValue({
      productName: selected.displayName,
      productoId: selected.productoId,
    });
  }

  ProductModaladd(): void {
    this.dialogHandlerS
      .openDialog(
        ProductModalAdd,
        { solicitudCompraId: this.solicitudCompraId(), id: "" },
        "Agregar",
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => {
        if (result) {
          this.updateData.emit();
        }
      });
  }
  onProductCleared(): void {
    this.form.patchValue({
      productName: "",
      productoId: null,
    });
    this.products.set([]);
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const formVal = this.form.getRawValue();
    const payload = {
      productoId: formVal.productoId,
      cantidad: formVal.cantidad,
      unidadMedidaId: formVal.unidadMedidaId,
      solicitudCompraId: this.solicitudCompraId(),
      applicationUserId: this.authS.applicationUserId,
    };

    this.apiResponseS
      .onPost(Endpoints.PurchaseRequestDetails.create, payload)
      .then((result: boolean) => {
        if (result) {
          this.updateData.emit();
          this.resetForm();
        }
      });
  }

  resetForm(): void {
    this.form.reset({
      productoId: null,
      productName: "",
      cantidad: 1,
      unidadMedidaId: "",
      solicitudCompraId: null,
      applicationUserId: this.authS.applicationUserId,
    });
    this.productSearchControl.setValue(null);
    this.products.set([]);
  }

  productLabel(item: IProductSuggestion | string | null): string {
    if (!item) return "";
    return typeof item === "string" ? item : item.displayName;
  }
}
