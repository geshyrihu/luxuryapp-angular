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
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

@Component({
  selector: "app-warehouse-stock-edit",
  templateUrl: "./warehouse-stock-edit.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
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
  id = signal<number>(0);
  cb_measurementUnits = signal<ISelectItem[]>([]);
  cb_almacenes = signal<ISelectItem[]>([]);

  form = this.formB.nonNullable.group({
    id: [{ value: 0, disabled: true }],
    customerId: [this.customerIdS.customerId(), [Validators.required]],
    productoId: ["", [Validators.required]],
    almacenId: ["", [Validators.required]],
    producto: [""],
    existencia: [0, [Validators.required]],
    unidadDeMedidaId: ["", [Validators.required]],
    stockMin: [0, [Validators.required]],
    stockMax: [0, [Validators.required]],
    applicationUserId: [this.authS.applicationUserId],
  });

  ngOnInit(): void {
    this.onLoadProducts();
    this.id.set(this.config.data.id);
    if (this.id() !== 0) this.onLoadData();
  }

  onLoadProducts() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>("getMeasurementUnits")
      .then((response: ISelectItem[]) => {
        this.cb_measurementUnits.set(response);
      });
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(
        "almacenes/" + this.customerIdS.customerId(),
      )
      .then((response: ISelectItem[]) => {
        this.cb_almacenes.set(response);
      });
  }

  onLoadData() {
    const urlApi = `InventarioProducto/${this.id()}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    if (this.id() === 0) {
      this.apiResponseS
        .onPost(`InventarioProducto`, this.form.getRawValue())
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(`InventarioProducto/${this.id()}`, this.form.getRawValue())
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
