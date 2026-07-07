import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { TagModule } from "primeng/tag";
import { lastValueFrom } from "rxjs";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

// ... (Interface IOrdenCompraDatosPagoForm remains the same)
export interface IOrdenCompraDatosPagoForm {
  id: FormControl<string | null>;
  ordenCompraId: FormControl<number | null>;
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
    MessageModule,
    TagModule,
    CustomInputAutoComplete,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    WebButtonLabelSave,
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
  cb_providers = signal<ISelectItem[]>([]);
  cb_formaPago = signal<ISelectItem[]>([]);
  cb_payment_method = signal<ISelectItem[]>([]);
  cb_usoCfdi = signal<ISelectItem[]>([]);
  cb_tipoGasto = signal<ISelectItem[]>([]);
  fundingPeriodsByMonth = signal<any[]>([]);
  cb_fundingYear = signal<ISelectItem[]>([]);

  form: FormGroup<IOrdenCompraDatosPagoForm> =
    this.formB.group<IOrdenCompraDatosPagoForm>({
      id: new FormControl(""),
      ordenCompraId: new FormControl(0),
      formaDePagoId: new FormControl(0),
      metodoDePagoId: new FormControl(0),
      providerId: new FormControl(0, Validators.required),
      usoCFDIId: new FormControl(0),
      tipoGasto: new FormControl(null),
      provider: new FormControl("", Validators.required),
      fundingPeriod: new FormControl(null),
      fundingYear: new FormControl(null), // Nuevo control para el Aóo de fondeo
      reference: new FormControl(""),
      cuentaClave: new FormControl(""),
    });

  get f() {
    return this.form.controls;
  }

  public saveProviderId(item: ISelectItem): void {
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
      .onGetItem<any>(
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
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.providers(this.customerIdS.customerId()),
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.paymentMethod,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.useCFDI,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.wayToPay,
      ),
      lastValueFrom(this.enumSelectS.onLoadEnumList("ETipoGasto")),
      lastValueFrom(this.enumSelectS.onLoadEnumList("EFundingPeriod", false)),
    ];

    const [
      providers,
      paymentMethods,
      useCfdi,
      wayToPay,
      tipoGasto,
      fundingPeriods,
    ] = await Promise.all(promises);

    this.cb_providers.set((providers as ISelectItem[]) || []);
    this.cb_payment_method.set((paymentMethods as ISelectItem[]) || []);
    this.cb_usoCfdi.set((useCfdi as ISelectItem[]) || []);
    this.cb_formaPago.set((wayToPay as ISelectItem[]) || []);
    this.cb_tipoGasto.set((tipoGasto as ISelectItem[]) || []);
    this.processFundingPeriods((fundingPeriods as ISelectItem[]) || []);
    this.cb_fundingYear.set(this.generateYearOptions());

    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.PurchaseOrderPaymentData.getById(this.ordenCompraDatosPagoId),
    );
    this.form.patchValue(result);
  }

  // Nuevo método para generar opciones de Aóo
  private generateYearOptions(): ISelectItem[] {
    const currentYear = new Date().getFullYear();
    return [
      { label: (currentYear - 1).toString(), value: currentYear - 1 },
      { label: currentYear.toString(), value: currentYear },
      { label: (currentYear + 1).toString(), value: currentYear + 1 },
    ];
  }

  processFundingPeriods(periods: ISelectItem[]) {
    const months: any = {};
    periods.forEach((period) => {
      if (period && period.label) {
        const monthName = period.label.split(" ")[2];
        if (!months[monthName]) {
          months[monthName] = {
            monthName: monthName,
            quincenas: [],
          };
        }
        months[monthName].quincenas.push(period);
      }
    });
    this.fundingPeriodsByMonth.set(Object.values(months));
  }

  selectFundingPeriod(quincena: ISelectItem) {
    // Si la quincena seleccionada es la actual, la deselecciona.
    if (this.form.get("fundingPeriod").value === quincena.value) {
      this.form.get("fundingPeriod").setValue(null);
    } else {
      this.form.get("fundingPeriod").setValue(quincena.value);
    }
  }

  onSubmit() {
    // Aqué podrías Aóadir Validators.required al fundingPeriod y fundingYear
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
