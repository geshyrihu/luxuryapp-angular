import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  DiasNoHabilesCreateDTO,
  DiasNoHabilesDTO,
} from "../../../interfaces/periodo-nomina.interface";

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";

@Component({
  selector: "app-modal-dias-no-habiles",
  imports: [
    WebButtonIcon,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    WebButtonLabel,
    WebButtonLabelSave,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputSwitch,
  ],
  templateUrl: "./modal-dias-no-habiles.html",
})
export default class ModalDiasNoHabiles implements OnInit {
  private fb = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private dateS = inject(DateService);

  periodoId = signal<string>("");
  dias = signal<DiasNoHabilesDTO[]>([]);
  loading = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    fecha: ["", Validators.required],
    descripcion: ["", Validators.required],
    esFestivoOficial: [false],
  });

  ngOnInit(): void {
    const periodoId: string = this.config.data?.periodoId;
    this.periodoId.set(periodoId);
    this.loadDias(periodoId);
  }

  async loadDias(periodoId: string): Promise<void> {
    this.loading.set(true);
    const result = await this.apiResponseS.onGetList<DiasNoHabilesDTO[]>(
      Endpoints.HR.Nomina.Periodos.diasNoHabiles(periodoId),
    );
    this.dias.set((result as any) ?? []);
    this.loading.set(false);
  }

  async onSubmit(): Promise<void> {
    const periodoId = this.periodoId();
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.HR.Nomina.Periodos.diasNoHabiles(periodoId),
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: (v) =>
        ({
          ...v,
          fecha: this.dateS.getDateFormat(v.fecha),
        }) as DiasNoHabilesCreateDTO,
    });

    if (result) {
      this.form.reset({ esFestivoOficial: false });
      await this.loadDias(periodoId);
    }
  }

  async onDelete(diaId: string): Promise<void> {
    const periodoId = this.periodoId();
    const result = await this.apiResponseS.onDelete(
      Endpoints.HR.Nomina.Periodos.deleteDiaNoHabil(periodoId, diaId),
    );
    if (result) await this.loadDias(periodoId);
  }
}
