import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";

import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { EnumSelectService } from "@core/services/enum-select.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { lastValueFrom } from "rxjs";
import {
  generateYearOptions,
  groupFundingPeriodsByMonth,
  toggleFundingPeriodSelection,
} from "../funding-period-grouping";
import {
  PurchaseOrderFundingPeriodGroup,
  PurchaseOrderPaymentFormData,
  PurchaseOrderProviderData,
} from "../purchase-order.types";

// ... (Interface IOrdenCompraDatosPagoForm remains the same)
export interface IOrdenCompraDatosPagoForm {
  id: FormControl<string | null>;
  ordenCompraId: FormControl<string | null>;
  formaDePagoId: FormControl<number | null>;
  metodoDePagoId: FormControl<number | null>;
  providerId: FormControl<number | null>;
  usoCFDIId: FormControl<number | null>;
  tipoGasto: FormControl<number | null>;
  provider: FormControl<string | null>;
  fundingPeriod: FormControl<number | null>;
  fundingYear: FormControl<number | null>;
  reference: FormControl<string | null>;
  cuentaClave: FormControl<string | null>;
}

@Component({
  selector: "app-orden-compra-datos-pago",
  templateUrl: "./orden-compra-datos-pago.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    InputAutocomplete,
    LuxInputSelectSignal,
    LuxInputTextSignal,
    ButtonWeb,
    LxTag,
  ],
})
export class OrdenCompraDatosPago implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  enumSelectS = inject(EnumSelectService);
  customerIdS = inject(CustomerIdService);
  cdr = inject(ChangeDetectorRef);
  submitting = signal(false);

  ordenCompraDatosPagoId: string = "";
  cb_providers = signal<SelectItemDto[]>([]);
  cb_formaPago = signal<SelectItemDto[]>([]);
  cb_payment_method = signal<SelectItemDto[]>([]);
  cb_usoCfdi = signal<SelectItemDto[]>([]);
  cb_tipoGasto = signal<SelectItemDto[]>([]);
  fundingPeriodsByMonth = signal<PurchaseOrderFundingPeriodGroup[]>([]);
  cb_fundingYear = signal<SelectItemDto[]>([]);

  form: FormGroup<IOrdenCompraDatosPagoForm> =
    this.formB.group<IOrdenCompraDatosPagoForm>({
      id: new FormControl(""),
      ordenCompraId: new FormControl(""),
      formaDePagoId: new FormControl(0),
      metodoDePagoId: new FormControl(0),
      providerId: new FormControl(0, Validators.required),
      usoCFDIId: new FormControl(0),
      tipoGasto: new FormControl(null),
      provider: new FormControl("", Validators.required),
      fundingPeriod: new FormControl(null),
      fundingYear: new FormControl(null), // Nuevo control para el Año de fondeo
      reference: new FormControl(""),
      cuentaClave: new FormControl(""),
    });

  get f() {
    return this.form.controls;
  }

  public saveProviderId(item: SelectItemDto): void {
    if (!item) {
      this.form.patchValue({
        providerId: null,
        provider: "",
        reference: "",
        cuentaClave: "",
      });
      return;
    }

    this.form.patchValue({
      providerId: item.value,
      provider: item.label,
    });

    this.apiResponseS
      .onGetItem<PurchaseOrderProviderData>(
        Endpoints.Providers.getByIdAndCustomer(
          item.value,
          this.customerIdS.customerId(),
        ),
      )
      .then((provider) => {
        if (provider) {
          this.form.patchValue({
            reference: provider.referencia,
            cuentaClave: provider.interbankCode,
          });
        }
      });
  }

  async ngOnInit() {
    this.ordenCompraDatosPagoId =
      this.config.data.ordenCompra.ordenCompraDatosPago.id;

    const promises = [
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.providers(this.customerIdS.customerId()),
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.paymentMethod,
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.useCFDI,
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.wayToPay,
      ),
      lastValueFrom(this.enumSelectS.onLoadEnumList("tipo-gasto")),
      lastValueFrom(this.enumSelectS.onLoadEnumList("funding-period", false)),
    ];

    const [
      providers,
      paymentMethods,
      useCfdi,
      wayToPay,
      tipoGasto,
      fundingPeriods,
    ] = await Promise.all(promises);

    this.cb_providers.set((providers as SelectItemDto[]) || []);
    this.cb_payment_method.set((paymentMethods as SelectItemDto[]) || []);
    this.cb_usoCfdi.set((useCfdi as SelectItemDto[]) || []);
    this.cb_formaPago.set((wayToPay as SelectItemDto[]) || []);
    this.cb_tipoGasto.set((tipoGasto as SelectItemDto[]) || []);
    this.processFundingPeriods((fundingPeriods as SelectItemDto[]) || []);
    this.cb_fundingYear.set(generateYearOptions());

    const result =
      await this.apiResponseS.onGetItem<PurchaseOrderPaymentFormData>(
        Endpoints.PurchaseOrderPaymentData.getById(this.ordenCompraDatosPagoId),
      );
    if (result) this.form.patchValue(result);
  }

  processFundingPeriods(periods: SelectItemDto[]) {
    this.fundingPeriodsByMonth.set(groupFundingPeriodsByMonth(periods));
  }

  selectFundingPeriod(quincena: SelectItemDto) {
    const control = this.form.get("fundingPeriod");
    control?.setValue(
      toggleFundingPeriodSelection(control.value, quincena.value),
    );
  }

  onSubmit() {
    // Aqué podrías AñadirValidators.required al fundingPeriod y fundingYear
    // si ambos deben ser seleccionados al mismo tiempo.
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;

    const model = {
      ...formValue,
      sendToFunding:
        formValue.fundingPeriod !== null && formValue.fundingYear !== null,
    };

    this.apiResponseS
      .onPut(
        Endpoints.PurchaseOrderPaymentData.update(this.ordenCompraDatosPagoId),
        model,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false)); // Asegurarse de quitar el submitting en caso de error
  }
}
