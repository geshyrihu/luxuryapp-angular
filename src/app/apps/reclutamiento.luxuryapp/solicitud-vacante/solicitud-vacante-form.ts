import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { WorkSchedulePresentationService } from "src/app/core/services/work-schedule-presentation.service";
import { WorkPositionDetailDTO } from "./WorkPositionDetailDTO";

@Component({
  selector: "app-solicitud-vacante",
  templateUrl: "./solicitud-vacante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputTextAreaSignal,
    CurrencyPipe,
  ],
})
export class SolicitudVacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private schedulePresentationS = inject(WorkSchedulePresentationService);
  workPositionId: string = this.config.data.workPositionId;

  data: WorkPositionDetailDTO | null = null;
  submitting = signal(false);

  id: string = "";

  cb_tipoJornada = signal<SelectItemDto[]>([]);
  readonly dayColumns = [
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miércoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sábado", value: 6 },
    { label: "Domingo", value: 0 },
  ] as const;

  form = this.formB.nonNullable.group({
    id: [this.config.data.workPositionId],
    applicationRoleName: ["", Validators.required],
    sueldo: [0 as number, [Validators.required, Validators.min(0)]],
    sueldoBase: [0 as number, [Validators.required, Validators.min(0)]],
    tipoJornada: [null as number | null, Validators.required],
    additionalInformation: [""],
  });

  async ngOnInit() {
    this.cb_tipoJornada.set(
      await firstValueFrom(this.enumSelectS.tipoJornada()),
    );
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.WorkPositions.getById(this.workPositionId);
    this.apiResponseS
      .onGetItem<WorkPositionDetailDTO>(urlApi)
      .then((result) => {
        this.data = result;
        this.form.patchValue(result);
      });
  }

  tipoJornadaNameDisplay(): string {
    const value = this.data?.tipoJornada;
    const labelFromDto = this.data?.tipoJornadaName?.trim();
    if (labelFromDto) return labelFromDto;

    const option = this.cb_tipoJornada().find(
      (item) => `${item.value}` === `${value}`,
    );
    return option?.label ?? (value != null ? `${value}` : "No definido");
  }

  scheduleWeeks(): number[] {
    const days = this.data?.diasDeTrabajo ?? [];
    const maxWeek = days.length
      ? Math.max(...days.map((day) => day.numeroSemanaCiclo))
      : (this.data?.duracionCicloSemanas ?? 1);

    return Array.from({ length: maxWeek }, (_, index) => index + 1);
  }

  scheduleObservations(): string {
    return this.data?.observaciones?.trim() ?? "";
  }

  formatHoursSummary(multiplier: number): string {
    return this.formatHours(this.schedulePresentationS.weeklyAverageHours(this.data ?? {}) * multiplier);
  }

  scheduleCell(
    week: number,
    dayOfWeek: number,
    field: "entry" | "exit",
  ): string {
    const day = this.data?.diasDeTrabajo?.find(
      (item) => item.numeroSemanaCiclo === week && item.diaSemana === dayOfWeek,
    );

    if (day?.esDescanso) return "Descanso";

    const normalizedValue =
      field === "entry" ? day?.horaEntrada : day?.horaSalida;
    if (normalizedValue) return this.formatHour(normalizedValue);

    return "-";
  }

  private formatHour(value: string): string {
    return value.substring(0, 5);
  }

  private formatHours(value: number): string {
    return `${Number.isInteger(value) ? value : value.toFixed(1)} h`;
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        EndpointsReclutamiento.RecruitmentRequests.solicitudVacante(),
        this.form.getRawValue(),
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
