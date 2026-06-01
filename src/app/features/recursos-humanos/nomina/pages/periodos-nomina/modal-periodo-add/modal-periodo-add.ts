import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import {
  MES_OPTIONS,
  PeriodoNominaCreateDTO,
  PeriodoNominaDTO,
  PeriodoNominaUpdateDTO,
  QUINCENA_OPTIONS,
} from "../../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-modal-periodo-add",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomButtonSave,
  ],
  templateUrl: "./modal-periodo-add.html",
})
export default class ModalPeriodoAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);

  readonly quincenaOptions = QUINCENA_OPTIONS;
  readonly mesOptions = MES_OPTIONS;
  readonly anioActual = new Date().getFullYear();

  submitting = signal(false);
  item = signal<PeriodoNominaDTO | null>(null);

  form = this.fb.nonNullable.group({
    quincena:    [1, Validators.required],
    mes:         [new Date().getMonth() + 1, Validators.required],
    anio:        [this.anioActual, [Validators.required, Validators.min(2020)]],
    fechaInicio: ["" as string, Validators.required],
    fechaFin:    ["" as string, Validators.required],
    fechaPago:   ["" as string],
  });

  ngOnInit(): void {
    const data: PeriodoNominaDTO | undefined = this.config.data?.item;
    if (data) {
      this.item.set(data);
      this.form.patchValue({
        quincena:    data.quincena,
        mes:         data.mes,
        anio:        data.anio,
        fechaInicio: data.fechaInicio ? data.fechaInicio.substring(0, 10) : "",
        fechaFin:    data.fechaFin ? data.fechaFin.substring(0, 10) : "",
        fechaPago:   data.fechaPago ? data.fechaPago.substring(0, 10) : "",
      });
    }
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const customerId = this.customerIdS.customerId();
    const existing = this.item();

    if (!existing) {
      const dto: PeriodoNominaCreateDTO = {
        customerId,
        ...this.form.getRawValue(),
        fechaInicio: this.dateS.getDateFormat(this.form.controls.fechaInicio.value),
        fechaFin: this.dateS.getDateFormat(this.form.controls.fechaFin.value),
        fechaPago: this.form.controls.fechaPago.value
          ? this.dateS.getDateFormat(this.form.controls.fechaPago.value)
          : undefined,
      };
      this.submitting.set(true);
      this.apiResponseS
        .onPost("hr/nomina/periodos", dto)
        .then((r) => { if (r) this.ref.close(true); })
        .finally(() => this.submitting.set(false));
    } else {
      const v = this.form.getRawValue();
      const dto: PeriodoNominaUpdateDTO = {
        fechaInicio: v.fechaInicio ? this.dateS.getDateFormat(v.fechaInicio) : undefined,
        fechaFin:    v.fechaFin ? this.dateS.getDateFormat(v.fechaFin) : undefined,
        fechaPago:   v.fechaPago ? this.dateS.getDateFormat(v.fechaPago) : undefined,
      };
      this.submitting.set(true);
      this.apiResponseS
        .onPut(`hr/nomina/periodos/${existing.id}`, dto)
        .then((r) => { if (r) this.ref.close(true); })
        .finally(() => this.submitting.set(false));
    }
  }
}
