import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  NominaDetalleDTO,
  NominaDetalleEditDTO,
} from "../../../interfaces/nomina-detalle.interface";

@Component({
  selector: "app-modal-editar-empleado-nomina",
  imports: [
    ReactiveFormsModule,
    CustomInputNumberSignal,
    CustomInputDecimal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./modal-editar-empleado-nomina.html",
})
export default class ModalEditarEmpleadoNomina implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  submitting = signal(false);
  nominaId = signal<string>("");
  detalleId = signal<string>("");

  form = this.fb.nonNullable.group({
    diasTrabajados: [0, [Validators.required, Validators.min(0)]],
    diasAusentes: [0, [Validators.required, Validators.min(0)]],
    diasIncapacidad: [0, [Validators.required, Validators.min(0)]],
    diasVacaciones: [0, [Validators.required, Validators.min(0)]],
    diasPermisoConGoce: [0, [Validators.required, Validators.min(0)]],
    diasPermisoSinGoce: [0, [Validators.required, Validators.min(0)]],
    domingosTrabajados: [0, [Validators.required, Validators.min(0)]],
    tiempoExtraImporte: [0, [Validators.required, Validators.min(0)]],
    compensacion: [0, [Validators.required, Validators.min(0)]],
    otrasPercepciones: [0, [Validators.required, Validators.min(0)]],
    cuotaImss: [0, [Validators.required, Validators.min(0)]],
    isr: [0, [Validators.required, Validators.min(0)]],
    otrasDeducciones: [0, [Validators.required, Validators.min(0)]],
    observaciones: [""],
  });

  ngOnInit(): void {
    const item: NominaDetalleDTO = this.config.data?.item;
    const nominaId: string = this.config.data?.nominaId;
    this.nominaId.set(nominaId);
    this.detalleId.set(item.id);

    this.form.patchValue({
      diasTrabajados: item.diasTrabajados,
      diasAusentes: item.diasAusentes,
      diasIncapacidad: item.diasIncapacidad,
      diasVacaciones: item.diasVacaciones,
      diasPermisoConGoce: item.diasPermisoConGoce,
      diasPermisoSinGoce: item.diasPermisoSinGoce,
      domingosTrabajados: item.domingosTrabajados,
      tiempoExtraImporte: item.tiempoExtraImporte,
      compensacion: item.compensacion,
      otrasPercepciones: item.otrasPercepciones,
      cuotaImss: item.cuotaImss,
      isr: item.isr,
      otrasDeducciones: item.otrasDeducciones,
      observaciones: item.observaciones,
    });
  }

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.HR.Nomina.Encabezado.updateDetalle(
        this.nominaId(),
        this.detalleId(),
      ),
      method: "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue() as NominaDetalleEditDTO,
    });
  }
}
