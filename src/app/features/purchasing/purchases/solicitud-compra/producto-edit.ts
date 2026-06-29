import { Component, inject, OnInit, signal } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputNumberSignal } from "src/app/core/components/web/inputs/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-producto-edit",
  templateUrl: "./producto-edit.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomButtonSave,
  ],
})
export class ProductoEdit implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  authS = inject(AuthService);

  submitting = signal(false);
  id: string = "";
  data: any;
  solicitudCompraId: string = "";
  cb_unidadMedida = signal<ISelectItem[]>([]);
  nombreProducto = "";

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>(""),
    solicitudCompraId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    productoId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    nombreProducto: new FormControl<string>(""),
    cantidad: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unidadMedidaId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.onLoadSelectItem();
    this.id = this.config.data.id;
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.form.patchValue({
      id: this.id,
      solicitudCompraId: this.solicitudCompraId,
    });
    this.onLoadProduct();
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.SelectItems.measurementUnits)
      .then((response: ISelectItem[]) => {
        this.cb_unidadMedida.set(response);
      });
  }

  onLoadProduct() {
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseRequestDetails.editProduct(this.id))
      .then((result: any) => {
        this.data = result;
        this.nombreProducto = result.nombreProducto;
        this.form.patchValue(result);
      });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    // Actualizar el objeto data con los valores del formulario
    const formValue = this.form.getRawValue();
    const payload = {
      ...this.data,
      cantidad: formValue.cantidad,
      unidadMedidaId: formValue.unidadMedidaId,
      solicitudCompraId: formValue.solicitudCompraId,
    };

    this.apiResponseS
      .onPut(Endpoints.PurchaseRequestDetails.update(this.id), payload)
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}

