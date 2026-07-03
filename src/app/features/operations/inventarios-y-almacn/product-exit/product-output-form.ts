import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomInputTime } from "src/app/core/components/inputs/web/custom-input-time-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

interface IProductOutputForm {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  fechaSalida: FormControl<string>;
  productoId: FormControl<string>;
  cantidad: FormControl<number>;
  unidadMedidaId: FormControl<string | null>;
  almacenId: FormControl<string>;
  usoPrducto: FormControl<string>;
  quienUso: FormControl<string>;
  horaSalida: FormControl<string>;
  applicationUserId: FormControl<string>;
}
@Component({
  selector: "app-product-output-form",
  templateUrl: "./product-output-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class ProductOutputForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  destroyRef = inject(DestroyRef);
  submitting = signal(false);

  form: FormGroup<IProductOutputForm>;
  id: string = "";
  idProducto: string = "";
  nombreProducto = signal<string>("");
  almacenId: string = "";

  cb_productos = signal<any[]>([]);
  cb_measurement_unit = signal<ISelectItem[]>([]);
  dateTodat = new Date();
  cantidadActualUsada = signal<number>(0);
  existenciaAlmacen = signal<number>(0);
  cantidadDiferiencia = signal<number>(0);
  cantidadDisponible = signal<number>(0);

  get f() {
    return this.form.controls;
  }
  onLoadExistencia() {
    const urlApi = `InventarioProducto/GetExistenciaProducto/${this.customerIdS.customerId()}/${
      this.config.data.idProducto
    }/${this.config.data.almacenId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result !== null) {
        this.existenciaAlmacen.set(result.existencia);
        // Recalculate validation after loading existence
        this.form.controls.cantidad.updateValueAndValidity();
      }
    });
  }
  ngOnInit(): void {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(`getMeasurementUnits`)
      .then((response: any) => {
        this.cb_measurement_unit.set(response);
      });

    this.id = this.config.data.id;
    this.almacenId = this.config.data.almacenId;
    this.nombreProducto.set(this.config.data.nombreProducto);
    this.idProducto = this.config.data.idProducto;

    this.onLoadExistencia();

    this.form = this.formB.group({
      id: new FormControl("", { nonNullable: true }),
      customerId: new FormControl<string | null>(
        this.customerIdS.customerId(),
        { validators: [Validators.required] },
      ),
      fechaSalida: new FormControl(this.dateS.getDateNow(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      productoId: new FormControl(this.idProducto, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      cantidad: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      unidadMedidaId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      almacenId: new FormControl(this.almacenId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      usoPrducto: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      quienUso: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      horaSalida: new FormControl(
        `${this.dateTodat.getHours()}:${this.dateTodat.getMinutes()}`,
        { nonNullable: true, validators: [Validators.required] },
      ),
      applicationUserId: new FormControl(this.authS.applicationUserId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    if (this.id) this.onLoadData();

    // Stock validation
    this.form.controls.cantidad.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cantidadSeleccionada) => {
        if (cantidadSeleccionada !== null) {
          this.cantidadDiferiencia.set(
            cantidadSeleccionada - this.cantidadActualUsada(),
          );
          const disponible =
            this.existenciaAlmacen() - this.cantidadDiferiencia();
          this.cantidadDisponible.set(disponible);

          if (disponible < 0) {
            this.form.controls.cantidad.setErrors({ stockInsuficiente: true });
          } else {
            // Remove error if it exists
            const errors = this.form.controls.cantidad.errors;
            if (errors && errors["stockInsuficiente"]) {
              delete errors["stockInsuficiente"];
              this.form.controls.cantidad.setErrors(
                Object.keys(errors).length ? errors : null,
              );
            }
          }
        }
      });
  }

  onLoadData() {
    const urlApi = `SalidaProductos/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.nombreProducto.set(result.producto);
      this.cantidadActualUsada.set(result.cantidad);
      result.fechaSalida = this.dateS.getDateFormat(result.fechaSalida);
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    this.id = this.config.data.id;
    const values = this.form.getRawValue();
    const payload = {
      ...values,
      fechaSalida: this.dateS.getDateFormat(values.fechaSalida),
    };

    this.submitting.set(true);
    if (!this.id) {
      this.apiResponseS
        .onPost(`SalidaProductos`, payload)
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(
          `SalidaProductos/${this.id}/${this.cantidadActualUsada()}`,
          payload,
        )
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}
