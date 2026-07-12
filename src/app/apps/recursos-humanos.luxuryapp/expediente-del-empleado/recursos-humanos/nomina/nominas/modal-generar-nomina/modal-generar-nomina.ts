import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { GenerarNominaDTO } from '../../interfaces/nomina-encabezado.interface';
import { PeriodoNominaDTO } from '../../interfaces/periodo-nomina.interface';

@Component({
  selector: "app-modal-generar-nomina",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./modal-generar-nomina.html",
})
export default class ModalGenerarNomina implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  periodosOptions = signal<SelectItemDto[]>([]);

  form = this.fb.nonNullable.group({
    periodoNominaId: ["", Validators.required],
    soloEmpleadosActivos: [true],
    incluirTiempoExtra: [true],
    sincronizarIncidencias: [false],
  });

  ngOnInit(): void {
    const periodoId: string | undefined = this.config.data?.periodoId;
    this.loadPeriodos(periodoId);
  }

  async loadPeriodos(preselectedId?: string): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const anio = new Date().getFullYear();
    const result = await this.apiResponseS.onGetList<PeriodoNominaDTO[]>(
      Endpoints.HR.Nomina.Periodos.byCustomerAndYear(customerId, anio),
    );
    const options: SelectItemDto[] = ((result as any) ?? []).map((p: any) => ({
      label: p.quincenaDisplay,
      value: p.id,
    }));
    this.periodosOptions.set(options);
    if (preselectedId) {
      this.form.controls["periodoNominaId"].setValue(preselectedId);
    }
  }

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.HR.Nomina.Generar.nomina,
      method: "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (v) =>
        ({
          customerId: this.customerIdS.customerId(),
          ...v,
        }) as GenerarNominaDTO,
    });
  }
}
