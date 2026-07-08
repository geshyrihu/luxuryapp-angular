import { Component, OnInit, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
;
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  ConfiguracionNominaDTO,
  ConfiguracionNominaUpdateDTO,
  FRECUENCIA_PAGO_OPTIONS,
} from "../../interfaces/configuracion-nomina.interface";

@Component({
  selector: "app-configuracion-nomina",
  imports: [
    ReactiveFormsModule,
    LxFieldset,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputDecimal,
    WebButtonLabelSave
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./configuracion-nomina.html",
})
export default class ConfiguracionNomina implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  readonly frecuenciaPagoOptions = FRECUENCIA_PAGO_OPTIONS;
  loading = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    frecuenciaPago: [0, Validators.required],
    diaPago1: [
      15,
      [Validators.required, Validators.min(1), Validators.max(31)]
    ],
    diaPago2: [
      30,
      [Validators.required, Validators.min(1), Validators.max(31)]
    ],
    diasAguinaldo: [15, [Validators.required, Validators.min(15)]],
    factorPrimaVacacional: [0.25, [Validators.required, Validators.min(0.25)]],
    minutosToleranciaRetardo: [10, [Validators.required, Validators.min(0)]],
    retardosPorFalta: [3, [Validators.required, Validators.min(1)]],
    porcentajeEnfermedadMaternidad: [
      0.00625,
      [Validators.required, Validators.min(0)]
    ],
    porcentajeIvcm: [0.00625, [Validators.required, Validators.min(0)]],
    porcentajeCesantiaVejez: [
      0.01125,
      [Validators.required, Validators.min(0)]
    ],
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.loadData(customerId);
    });
  }

  ngOnInit(): void {}

  async loadData(customerId: string): Promise<void> {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetItem<ConfiguracionNominaDTO>(
      Endpoints.HR.Nomina.Configuracion.getByCustomer(customerId),
    );
    this.loading.set(false);
    if (result) {
      this.form.patchValue({
        frecuenciaPago: result.frecuenciaPago,
        diaPago1: result.diaPago1,
        diaPago2: result.diaPago2,
        diasAguinaldo: result.diasAguinaldo,
        factorPrimaVacacional: result.factorPrimaVacacional,
        minutosToleranciaRetardo: result.minutosToleranciaRetardo,
        retardosPorFalta: result.retardosPorFalta,
        porcentajeEnfermedadMaternidad: result.porcentajeEnfermedadMaternidad,
        porcentajeIvcm: result.porcentajeIvcm,
        porcentajeCesantiaVejez: result.porcentajeCesantiaVejez,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.submitting.set(true);
    const dto: ConfiguracionNominaUpdateDTO = this.form.getRawValue();
    await this.apiResponseS.onPut(
      Endpoints.HR.Nomina.Configuracion.update(customerId),
      dto,
    );
    this.submitting.set(false);
  }
}
