import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { SolicitudCompraService } from "src/app/core/services/solicitud-compra.service";

@Component({
  selector: "app-product-add",
  templateUrl: "./product-add.html",
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CustomButtonSave,
    CustomInputSelectSignal,
    CustomInputTextSignal,
  ],
})
export class ProductAdd implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  solicitudCompraService = inject(SolicitudCompraService);

  @Input() solicitudCompraId: string = "";
  @Output() updateData = new EventEmitter<void>();

  cb_measurement_units = signal<ISelectItem[]>([]);
  products = signal<any[]>([]); // Convertido a Signal para mejor reactividad

  // Control independiente solo para la UI del autocomplete (si se usa)
  productSearchControl = new FormControl<ISelectItem | null>(null);

  // Definición estricta del formulario
  form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    productoId: new FormControl<number | null>(null),
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
    solicitudCompraId: new FormControl<number | null>(null),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId),
  });

  valueChangesSignal = toSignal(this.productSearchControl.valueChanges);

  constructor() {
    effect(() => {
      const value: any = this.valueChangesSignal();
      if (value) {
        const productoId =
          value && typeof value === "object" ? value.value : null;
        this.form.patchValue({ productoId });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.onLoadMeasurementUnits();
  }

  async onLoadMeasurementUnits(): Promise<void> {
    const result: any = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      "getMeasurementUnits",
    );
    this.cb_measurement_units.set(result as ISelectItem[]);
  }

  onLoadProduct(param: string) {
    this.apiResponseS
      .onGetListNotLoading(
        `SolicitudCompraDetalle/SearchToAddRequest/${this.solicitudCompraId}`,
        {
          param: param,
        },
      )
      .then((result: any) => {
        this.products.set(result);
      });
  }

  onSelect(event: ISelectItem): void {
    this.form.patchValue({
      productoId: event.value,
    });
    this.productSearchControl.setValue(event, { emitEvent: false });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const formVal = this.form.getRawValue();
    const payload = {
      productoId: formVal.productoId,
      cantidad: formVal.cantidad,
      unidadMedidaId: formVal.unidadMedidaId,
      solicitudCompraId: this.solicitudCompraId,
      applicationUserId: this.authS.applicationUserId,
    };

    this.apiResponseS
      .onPost(`SolicitudCompraDetalle`, payload)
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
      cantidad: 1,
      unidadMedidaId: "",
      solicitudCompraId: null,
      applicationUserId: this.authS.applicationUserId,
    });
    this.productSearchControl.setValue(null);
    this.products.set([]);
  }

  public onInputProduct(event: any): void {
    const value = event.target.value;
    if (value && value.length >= 2) {
      this.onLoadProduct(value);
    } else {
      this.products.set([]);
    }
  }

  public onSelectProduct(e: any): void {
    let find = this.products().find((x) => x?.producto === e.target.value);
    this.form.patchValue({
      productoId: find?.productoId,
    });
  }
}
