import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { GastoFijoPresupuesto } from "src/app/features/tenant/expense-catalog-budget/gasto-fijo-presupuesto";
import { GastoFijoServicios } from "src/app/features/tenant/expense-catalog-detail/gasto-fijo-servicios";

interface ICatalogoGastoFijoForm {
  id: FormControl<string>;
  customerId: FormControl<string>;
  equipoOInstalacion: FormControl<string>;
  justificacionGasto: FormControl<string>;
  quincena: FormControl<number>;
  providerName: FormControl<string | null>;
  providerId: FormControl<string>;
  idFondeo: FormControl<number>;
  usoCFDIId: FormControl<string | null>;
  metodoDePagoId: FormControl<string | null>;
  formaDePagoId: FormControl<string | null>;
  crearOrdenCompra: FormControl<boolean>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-catalogo-gasto-fijo-form",
  templateUrl: "./catalogo-gasto-fijo-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputAutoComplete,
    CustomInputSelectSignal,
    CustomButton,
    CustomButtonSave,
    CardModule,
    MessageModule,
  ],
})
export class CatalogoGastoFijoForm implements OnInit {
  // InyecciÃ³n de dependencias
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);
  routeActive = inject(ActivatedRoute);

  // Signals para el estado del componente
  id = signal<string>("");
  submitting = signal(false);

  // Signals para las listas
  budgets = signal<CatalogPurchaseOrderBudgetAddOrEditDTO[]>([]);
  detalles = signal<CatalogoGastosFijosDetalleAddOrEditDTO[]>([]);

  // Signals para ComboBoxes
  cb_providers = signal<ISelectItem[]>([]);
  cb_usoCFDI = signal<ISelectItem[]>([]);
  cb_metodoDePago = signal<ISelectItem[]>([]);
  cb_formaDePago = signal<ISelectItem[]>([]);
  cb_quincena = signal<ISelectItem[]>([
    { label: "Primera Quincena", value: 0 },
    { label: "Segunda Quincena", value: 1 },
  ]);

  // Formulario reactivo tipado
  form: FormGroup<ICatalogoGastoFijoForm> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    customerId: new FormControl(this.customerIdS.customerId(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    equipoOInstalacion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    justificacionGasto: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    quincena: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    providerName: new FormControl<string | null>(null),
    providerId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    idFondeo: new FormControl(0, { nonNullable: true }),
    usoCFDIId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    metodoDePagoId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    formaDePagoId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    crearOrdenCompra: new FormControl(false, { nonNullable: true }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
    }),
  });

  paramsSignal = toSignal(this.routeActive.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params && params["id"]) {
        this.id.set(params["id"]);
        if (this.id()) {
          this.onLoadData();
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.onLoadCombos();

    if (this.id()) {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const urlApi = `CatalogoGastosFijos/${this.id()}`;
    const result: any = await this.apiResponseS.onGetItem(urlApi);

    if (!result) return;

    // Buscar el provider completo para el autocomplete
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === String(result.providerId),
    );

    this.form.patchValue({
      ...result,
      providerId: String(result.providerId),
      providerName: selectedProvider?.label || null,
      usoCFDIId: result.usoCFDIId ? String(result.usoCFDIId) : null,
      metodoDePagoId: result.metodoDePagoId
        ? String(result.metodoDePagoId)
        : null,
      formaDePagoId: result.formaDePagoId ? String(result.formaDePagoId) : null,
    });

    // Mapear colecciones segÃ³n el DTO: CatalogoGastosFijosDTO
    this.detalles.set(result.detalles || []);
    this.budgets.set(result.presupuesto || []);
  }

  async onLoadCombos(): Promise<void> {
    const [usoCFDI, metodoDePago, formaDePago, providers] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("UseCFDI"),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("PaymentMethod"),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>("WayToPay"),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        `providers/${this.customerIdS.customerId()}`,
      ),
    ]);

    this.cb_usoCFDI.set((usoCFDI as ISelectItem[]) || []);
    this.cb_metodoDePago.set((metodoDePago as ISelectItem[]) || []);
    this.cb_formaDePago.set((formaDePago as ISelectItem[]) || []);
    this.cb_providers.set((providers as ISelectItem[]) || []);
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    const formValue = this.form.getRawValue();

    // Construir payload limpio para el DTO de C#
    const payload = {
      ...formValue,
      idFondeo: Number(formValue.idFondeo),
      quincena: Number(formValue.quincena),
    };

    // Eliminar propiedades visuales o que causan error de mapeo (Guid no nulable)
    delete (payload as any).providerName;

    if (!this.id()) {
      delete (payload as any).id; // No enviar ID si es nuevo
    } else {
      payload.id = this.id();
    }

    const request = !this.id()
      ? this.apiResponseS.onPost(`CatalogoGastosFijos`, payload)
      : this.apiResponseS.onPut(`CatalogoGastosFijos/${this.id()}`, payload);

    request.then((result: any) => {
      if (result) {
        if (!this.id() && result.id) {
          this.id.set(String(result.id));
        }
        this.onLoadData();
      }
      this.submitting.set(false);
    });
  }

  // GestiÃ³n de la lista de Presupuesto
  onAddOrEditBudget() {
    this.dialogHandlerS
      .openDialog(
        GastoFijoPresupuesto,
        { catalogoGastosFijosId: this.id() },
        "Agregar/Editar Cuenta de Presupuesto",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        if (this.id()) {
          this.onLoadData();
        }
      });
  }

  // GestiÃ³n de la lista de Detalles/Productos
  onAddOrEditDetail() {
    this.dialogHandlerS
      .openDialog(
        GastoFijoServicios,
        { catalogoGastosFijosId: this.id() },
        "Agregar | Editar Producto o Servicio",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        if (this.id()) {
          this.onLoadData();
        }
      });
  }

  // Computed property para el total
  total = computed(() => {
    return this.detalles().reduce(
      (acc, item) => acc + item.cantidad * item.precio,
      0,
    );
  });

  saveProviderId = (item: ISelectItem) =>
    this.form.patchValue({
      providerId: String(item?.value),
      providerName: item?.label,
    });
}

export interface CatalogoGastosFijosAddOrEditDTO {
  id: any;
  customerId: string;
  equipoOInstalacion: string;
  justificacionGasto: string;
  quincena: number;
  providerId: any;
  idFondeo: number;
  usoCFDIid: any;
  metodoDePagoid: any;
  formaDePagoid: any;
  crearOrdenCompra: boolean;
  applicationUserId: string;
  budgets: CatalogPurchaseOrderBudgetAddOrEditDTO[];
  detalles: CatalogoGastosFijosDetalleAddOrEditDTO[];
}

export interface CatalogPurchaseOrderBudgetAddOrEditDTO {
  catalogoGastosFijosId: any;
  fiscalYear: string;
  accountNumber: string;
  accountName: string;
  amount: number;
}

export interface CatalogoGastosFijosDetalleAddOrEditDTO {
  catalogoGastosFijosId: any;
  productoId: any;
  cantidad: number;
  unidadMedidaid: any;
  precio: number;
  // Campos adicionales para visualizaciÃ³n
  productoDescription?: string;
}

