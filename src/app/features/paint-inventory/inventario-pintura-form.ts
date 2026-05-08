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
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IInventarioPinturaForm {
  id: FormControl<string>;
  machineryId: FormControl<number | null>;
  machinery: FormControl<string | null>;
  area: FormControl<string>;
  productoId: FormControl<number | null>;
  producto: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-inventario-pintura-form",
  templateUrl: "./inventario-pintura-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputAutoComplete,
    CustomButtonSave,
  ],
})
export class InventarioPinturaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_machinery = signal<ISelectItem[]>([]);
  cb_producto = signal<ISelectItem[]>([]);

  form: FormGroup<IInventarioPinturaForm> = this.formB.group({
    id: new FormControl(this.id, { nonNullable: true }),
    machineryId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    machinery: new FormControl<string | null>(null),
    area: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    productoId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    producto: new FormControl<string | null>(null),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId,
    ),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onLoadSelectItems();

    if (this.id) {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [machinery, productos] = await Promise.all([
      this.apiResponseS.onGetList(
        `Machineries/GetAutocompeteInv/${this.customerIdS.customerId()}`,
      ),
      this.apiResponseS.onGetList(`productos/getautocompleteselectitem/`),
    ]);

    this.cb_machinery.set(machinery as ISelectItem[]);
    this.cb_producto.set(productos as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `InventarioPintura/${this.id}`,
    );

    // Extraer IDs
    const machineryId =
      typeof result.machineryId === "object"
        ? result.machineryId.value
        : result.machineryId;
    const productoId =
      typeof result.productoId === "object"
        ? result.productoId.value
        : result.productoId;

    // Buscar objetos completos
    const selectedMachinery = this.cb_machinery().find(
      (item) => item.value === machineryId,
    );
    const selectedProducto = this.cb_producto().find(
      (item) => item.value === productoId,
    );

    this.form.patchValue({
      ...result,
      machineryId,
      machinery: selectedMachinery || null,
      productoId,
      producto: selectedProducto || null,
    });
  }

  saveProductoId = (item: any) => {
    this.form.patchValue({
      productoId: item?.value,
      producto: item?.label,
    });
  };
  saveMachineryId = (item: any) => {
    this.form.patchValue({
      machineryId: item?.value,
      machinery: item?.label,
    });
  };

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const request =
      this.id === ""
        ? this.apiResponseS.onPost(`InventarioPintura`, this.form.getRawValue())
        : this.apiResponseS.onPut(
            `InventarioPintura/${this.id}`,
            this.form.getRawValue(),
          );

    request.then((result: boolean) => {
      result ? this.ref.close(true) : this.submitting.set(false);
    });
  }
}









