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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { DateService } from "src/app/core/services/date.service";

interface IProductEntryForm {
  id: FormControl<string>;
  providerId: FormControl<number | null>;
  customerId: FormControl<string | null>;
  fechaEntrada: FormControl<string>;
  productoId: FormControl<number | null>;
  nombreProducto: FormControl<string | null>;
  almacenId: FormControl<number | null>;
  cantidad: FormControl<number>;
  unidadMedidaId: FormControl<number | null>;
  numeroFactura: FormControl<string>;
  providerName: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-product-entry-form",
  templateUrl: "./product-entry-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputAutoComplete,
    WebButtonLabelSave,
  ],
})
export class ProductEntryForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  cb_almacenes = signal<ISelectItem[]>([]);
  cb_measurement_unit = signal<ISelectItem[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  cb_productos = signal<ISelectItem[]>([]);

  id = signal("");
  idProducto = signal(0);
  cantidadActual = signal(0);
  mostrarProductos = signal(false);

  form: FormGroup<IProductEntryForm> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    providerId: new FormControl(null, [Validators.required]),
    customerId: new FormControl(this.customerIdS.customerId(), [
      Validators.required,
    ]),
    fechaEntrada: new FormControl(this.dateS.getDateNow(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    productoId: new FormControl(0, [Validators.required]),
    nombreProducto: new FormControl({ value: "", disabled: true }),
    almacenId: new FormControl(this.config.data.almacenId, [
      Validators.required,
    ]),
    cantidad: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    unidadMedidaId: new FormControl(null, [Validators.required]),
    numeroFactura: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    providerName: new FormControl(null),
    applicationUserId: new FormControl(this.authS.applicationUserId, [
      Validators.required,
    ]),
  });

  public saveProviderId(item: ISelectItem): void {
    this.form.patchValue({
      providerId: item?.value,
      providerName: item?.label,
    });
  }

  async ngOnInit(): Promise<void> {
    this.id.set(this.config.data.id);
    this.idProducto.set(this.config.data.idProducto);
    this.mostrarProductos.set(this.config.data.idProducto == 0);

    this.form.patchValue({
      id: this.id(),
      productoId: this.config.data.idProducto,
      nombreProducto: this.config.data.nombreProducto,
      almacenId: this.config.data.almacenId,
    });

    // Cargar todos los datos en paralelo
    await Promise.all([
      this.loadMeasurementUnits(),
      this.loadProviders(),
      this.loadAlmacenes(),
      this.loadProducts(),
    ]);

    // Cargar datos del formulario despuós de tener los providers
    if (this.id()) {
      await this.onLoadData();
    }
  }

  private async loadMeasurementUnits(): Promise<void> {
    const data =
      await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        `getMeasurementUnits`,
      );
    this.cb_measurement_unit.set(data);
  }

  private async loadProviders(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `Providers/${this.customerIdS.customerId()}`,
    );
    this.cb_providers.set(data);
  }

  private async loadAlmacenes(): Promise<void> {
    const data = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      `almacenes/${this.customerIdS.customerId()}`,
    );
    this.cb_almacenes.set(data);
  }

  private async loadProducts(): Promise<void> {
    const data = await this.apiResponseS.onGetList<ISelectItem[]>(
      `productos/getautocompleteselectitem/`,
    );
    this.cb_productos.set(data);
  }

  async onLoadData(): Promise<void> {
    const urlApi = `EntradaProducto/${this.id()}`;
    const result: any = await this.apiResponseS.onGetItem(urlApi);

    this.cantidadActual.set(result.cantidad);

    // Extraer el ID si viene como objeto
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;

    // Buscar el provider completo
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );

    // Actualizar el formulario
    this.form.patchValue({
      ...result,
      nombreProducto: result.nombreProducto,
      providerId: providerId,
      providerName: selectedProvider || null,
      fechaEntrada: this.dateS.getDateFormat(result.fechaEntrada),
    });
  }

  async onSubmit() {
    const isNew = !this.id() || this.id() === "0";
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: isNew
        ? `EntradaProducto`
        : `EntradaProducto/${this.id()}/${this.cantidadActual()}`,
      method: isNew ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (values) => ({
        ...values,
        fechaEntrada: this.dateS.getDateFormat(values.fechaEntrada),
        customerId: this.customerIdS.customerId(),
      }),
    });
  }
}
