import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  effect,
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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

interface IPurchaseRequestAddProductForm {
  id: FormControl<string | null>;
  productId: FormControl<string | null>;
  productName: FormControl<any | null>;
  quantity: FormControl<number>;
  unitId: FormControl<string>;
  purchaseRequestId: FormControl<string>;
}

@Component({
  selector: "app-purchase-request-add-product",
  templateUrl: "./purchase-request-add-product.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class PurchaseRequestAddProduct implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);

  submitting = signal(false);

  // Signals para ComboBoxes
  products = signal<ISelectItem[]>([]);
  cb_measurement_units = signal<ISelectItem[]>([]);

  purchaseRequestId = input<string>("");
  productDataToEdit = input<any | null>(null);

  updateData = output<void>();

  constructor() {
    effect(
      () => {
        const product = this.productDataToEdit();
        if (product) {
          this.loadProductForEdit(product);
        } else {
          this.resetForm();
        }
      },
      { allowSignalWrites: true },
    );
  }

  // Definición estricta del formulario con new FormGroup
  form: FormGroup<IPurchaseRequestAddProductForm> =
    new FormGroup<IPurchaseRequestAddProductForm>({
      id: new FormControl<string | null>(null),
      productId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      productName: new FormControl<any | null>(null, {
        validators: [Validators.required],
      }), // Puede ser objeto ISelectItem o string
      quantity: new FormControl<number>(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      unitId: new FormControl<string>("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      purchaseRequestId: new FormControl<string>("", { nonNullable: true }),
    });

  async ngOnInit(): Promise<void> {
    await this.onLoadMeasurementUnits();
  }

  async onLoadMeasurementUnits(): Promise<void> {
    const result: any = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.measurementUnits,
    );
    this.cb_measurement_units.set(result as ISelectItem[]);
  }

  async onLoadProduct(param: string): Promise<void> {
    const result: any = await this.apiResponseS.onGetListNotLoading(
      Endpoints.PurchaseRequests.searchToAdd(this.purchaseRequestId()),
      { param },
    );

    // Convertir a formato ISelectItem
    const productItems: ISelectItem[] = result.map((item: any) => ({
      label: item.product,
      value: item.productId,
    }));

    this.products.set(productItems);
  }

  loadProductForEdit(product: any): void {
    if (product) {
      // Extraer productId
      let productId = null;
      if (product.productId !== null && product.productId !== undefined) {
        productId =
          typeof product.productId === "object" && product.productId !== null
            ? (product.productId as any).value
            : product.productId;
      }

      // Extraer unitId
      let unitId = null;
      if (product.unitId !== null && product.unitId !== undefined) {
        unitId =
          typeof product.unitId === "object" && product.unitId !== null
            ? (product.unitId as any).value
            : product.unitId;
      }

      // Buscar el producto completo
      const selectedProduct = productId
        ? { label: product.productName || product.product, value: productId }
        : null;

      this.form.patchValue({
        id: product.id,
        productId,
        productName: selectedProduct, // Asignamos el objeto al AutoComplete
        quantity: product.quantity,
        unitId,
      });
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.form.reset({
      id: null,
      productId: null,
      productName: null,
      quantity: 1,
      unitId: "",
      purchaseRequestId: this.purchaseRequestId(),
    });
    this.products.set([]);
  }

  searchProducts(event: any): void {
    const query = event.query;
    if (query && query.length >= 2) {
      this.onLoadProduct(query);
    } else {
      this.products.set([]);
    }
  }

  onSelectProduct(event: any) {
    // El evento puede ser directamente el objeto seleccionado o event.value
    const item = event.value || event;
    this.form.patchValue({
      productId: item?.value,
      productName: item, // Mantenemos el objeto en el control visible
    });
  }

  async onSubmit() {
    const payload = {
      id: this.form.value.id,
      productId: this.form.value.productId,
      quantity: this.form.value.quantity,
      unitId: this.form.value.unitId,
      purchaseRequestId: this.purchaseRequestId(),
    };

    const endpoint = payload.id
      ? Endpoints.PurchaseRequests.updateProduct(payload.id)
      : Endpoints.PurchaseRequests.addProduct;

    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: endpoint,
      method: payload.id ? "PUT" : "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => payload,
    });

    if (result) {
      this.updateData.emit();
      this.resetForm();
    }
  }
}
