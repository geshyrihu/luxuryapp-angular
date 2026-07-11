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
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IInventarioIluminacionForm {
  id: FormControl<string>;
  machineryId: FormControl<number | null>;
  machinery: FormControl<string | null>;
  area: FormControl<string>;
  cantidad: FormControl<number | null>;
  productoId: FormControl<number | null>;
  producto: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-inventario-iluminacion-form",
  templateUrl: "./inventario-iluminacion-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    InputAutocomplete,
    CustomInputNumberSignal,
    WebButtonLabelSave,
  ],
})
export class InventarioIluminacionForm implements OnInit {
  formB = inject(FormBuilder);
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_machinery = signal<SelectItemDto[]>([]);
  cb_producto = signal<SelectItemDto[]>([]);

  form: FormGroup<IInventarioIluminacionForm> = this.formB.group({
    id: new FormControl(this.id, { nonNullable: true }),
    machineryId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    machinery: new FormControl<string | null>(null),
    area: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cantidad: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    productoId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    producto: new FormControl<string | null>(null),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId as string | null,
      { validators: [Validators.required] },
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
      this.apiResponseS.onGetList(Endpoints.Products.autoComplete),
    ]);

    this.cb_machinery.set(machinery as SelectItemDto[]);
    this.cb_producto.set(productos as SelectItemDto[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `InventarioIluminacion/${this.id}`,
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
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "InventarioIluminacion",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const { machinery, producto, ...rest } = this.form.getRawValue();
        return rest;
      },
    });
  }
}
