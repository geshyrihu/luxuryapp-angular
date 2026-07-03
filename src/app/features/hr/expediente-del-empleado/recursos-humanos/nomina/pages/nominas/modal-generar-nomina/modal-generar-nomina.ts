import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { GenerarNominaDTO } from "../../../interfaces/nomina-encabezado.interface";
import { PeriodoNominaDTO } from "../../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-modal-generar-nomina",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
  templateUrl: "./modal-generar-nomina.html",
})
export default class ModalGenerarNomina implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  periodosOptions = signal<ISelectItem[]>([]);

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
    const options: ISelectItem[] = ((result as any) ?? []).map((p: any) => ({
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
