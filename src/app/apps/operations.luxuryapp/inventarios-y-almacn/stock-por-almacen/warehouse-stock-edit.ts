import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

@Component({
  selector: "app-warehouse-stock-edit",
  templateUrl: "./warehouse-stock-edit.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class WarehouseStockEdit implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  editId = signal<string | null>(null);
  cb_measurementUnits = signal<SelectItemDto[]>([]);
  cb_almacenes = signal<SelectItemDto[]>([]);
  formReady = signal(false);

  form!: ReturnType<typeof this.buildForm>;

  private buildForm(data?: any) {
    return this.formB.nonNullable.group({
      customerId: [data?.customerId ?? this.customerIdS.customerId(), [Validators.required]],
      productoId: [data?.productoId ?? "", [Validators.required]],
      almacenId: [data?.almacenId ?? "", [Validators.required]],
      producto: [data?.producto ?? ""],
      existencia: [data?.existencia ?? 0, [Validators.required]],
      unidadDeMedidaId: [data?.unidadDeMedidaId ?? "", [Validators.required]],
      stockMin: [data?.stockMin ?? 0, [Validators.required]],
      stockMax: [data?.stockMax ?? 0, [Validators.required]],
      applicationUserId: [data?.applicationUserId ?? this.authS.applicationUserId],
    });
  }

  ngOnInit(): void {
    this.onLoadProducts();
    this.editId.set(this.config.data.id);
    if (this.editId()) {
      this.onLoadData();
    } else {
      this.form = this.buildForm();
      this.formReady.set(true);
    }
  }

  onLoadProducts() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: SelectItemDto[]) => {
        this.cb_measurementUnits.set(response);
      });
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.almacenes(this.customerIdS.customerId()),
      )
      .then((response: SelectItemDto[]) => {
        this.cb_almacenes.set(response);
      });
  }

  onLoadData() {
    const urlApi = Endpoints.InventarioProducto.getById(this.editId());
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result) {
        this.form = this.buildForm(result);
        this.formReady.set(true);
      }
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    if (!this.editId()) {
      this.apiResponseS
        .onPost(Endpoints.InventarioProducto.create, this.form.getRawValue())
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          Endpoints.InventarioProducto.update(this.editId()!),
          this.form.getRawValue(),
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
