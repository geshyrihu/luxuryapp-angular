import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  DiasNoHabilesCreateDTO,
  DiasNoHabilesDTO,
} from "../../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-modal-dias-no-habiles",
  imports: [
    ReactiveFormsModule,
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonSave,
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
      `hr/nomina/periodos/${periodoId}/dias-no-habiles`,
    );
    this.dias.set((result as any) ?? []);
    this.loading.set(false);
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const periodoId = this.periodoId();
    const dto: DiasNoHabilesCreateDTO = {
      ...this.form.getRawValue(),
      fecha: this.dateS.getDateFormat(this.form.controls.fecha.value),
    };
    this.submitting.set(true);
    const result = await this.apiResponseS.onPost(
      `hr/nomina/periodos/${periodoId}/dias-no-habiles`,
      dto,
    );
    this.submitting.set(false);
    if (result) {
      this.form.reset({ esFestivoOficial: false });
      await this.loadDias(periodoId);
    }
  }

  async onDelete(diaId: string): Promise<void> {
    const periodoId = this.periodoId();
    const result = await this.apiResponseS.onDelete(
      `hr/nomina/periodos/${periodoId}/dias-no-habiles/${diaId}`,
    );
    if (result) await this.loadDias(periodoId);
  }
}
