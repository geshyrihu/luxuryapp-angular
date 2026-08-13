import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { candidateStageLabel } from "../recruitment-shared/candidate-stage-labels";
import { ChangeStageApplicationRequest } from "./interfaces/candidate-application";

@Component({
  selector: "app-candidate-stage-change-modal",
  standalone: true,
  templateUrl: "./candidate-stage-change-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomInputDateSignal,
    WebButtonLabelSave,
  ],
})
export class CandidateStageChangeModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  loadingInterviewers = signal(false);
  readonly stageEntrevistaReclutamiento =
    CandidateApplicationStage.EntrevistaReclutamiento;
  readonly stageEntrevistaOperaciones =
    CandidateApplicationStage.EntrevistaOperaciones;
  id: string = this.config.data.id;
  fromStage: CandidateApplicationStage = this.config.data.fromStage;
  requestPositionId: string = this.config.data.requestPositionId;
  cb_targetStages = signal<SelectItemDto[]>([]);
  cb_interviewers = signal<SelectItemDto[]>([]);

  form: FormGroup = new FormGroup({
    toStage: new FormControl<number | null>(null, Validators.required),
    comment: new FormControl<string | null>(null),
    recruitmentInterviewAt: new FormControl<string | null>(null),
    operationsInterviewAt: new FormControl<string | null>(null),
    operationsInterviewAssignedToUserId: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.cb_targetStages.set(this.resolveAllowedStages(this.fromStage));
    this.form.controls["toStage"].setValue(this.defaultTarget(this.fromStage));
    this.form.controls["toStage"].valueChanges.subscribe((value) => {
      if (value === CandidateApplicationStage.EntrevistaOperaciones) {
        this.onLoadInterviewers();
      }
    });
    if (
      this.form.controls["toStage"].value ===
      CandidateApplicationStage.EntrevistaOperaciones
    ) {
      this.onLoadInterviewers();
    }
  }

  resolveAllowedStages(from: CandidateApplicationStage): SelectItemDto[] {
    const map: Record<string, CandidateApplicationStage[]> = {
      [CandidateApplicationStage.Nuevo]: [
        CandidateApplicationStage.PreFiltro,
        CandidateApplicationStage.Rechazado,
        CandidateApplicationStage.NoSePresento,
      ],
      [CandidateApplicationStage.PreFiltro]: [
        CandidateApplicationStage.EnEspera,
        CandidateApplicationStage.EntrevistaReclutamiento,
        CandidateApplicationStage.Rechazado,
        CandidateApplicationStage.NoSePresento,
      ],
      [CandidateApplicationStage.EnEspera]: [
        CandidateApplicationStage.EntrevistaReclutamiento,
        CandidateApplicationStage.Rechazado,
        CandidateApplicationStage.NoSePresento,
      ],
      [CandidateApplicationStage.EntrevistaReclutamiento]: [
        CandidateApplicationStage.EntrevistaOperaciones,
        CandidateApplicationStage.EnEspera,
        CandidateApplicationStage.Rechazado,
        CandidateApplicationStage.NoSePresento,
      ],
      [CandidateApplicationStage.EntrevistaOperaciones]: [
        CandidateApplicationStage.Seleccionado,
        CandidateApplicationStage.EnEspera,
        CandidateApplicationStage.Rechazado,
        CandidateApplicationStage.NoSePresento,
      ],
      [CandidateApplicationStage.Seleccionado]: [
        CandidateApplicationStage.AltaEnProceso,
        CandidateApplicationStage.Rechazado,
      ],
      [CandidateApplicationStage.AltaEnProceso]: [
        CandidateApplicationStage.Contratado,
        CandidateApplicationStage.Rechazado,
      ],
    };
    const allowed = map[from] ?? [];
    return allowed.map((s) => ({
      value: s,
      label: candidateStageLabel(s),
    }));
  }

  defaultTarget(from: CandidateApplicationStage): number {
    switch (from) {
      case CandidateApplicationStage.Nuevo:
        return CandidateApplicationStage.PreFiltro;
      case CandidateApplicationStage.PreFiltro:
        return CandidateApplicationStage.EntrevistaReclutamiento;
      case CandidateApplicationStage.EnEspera:
        return CandidateApplicationStage.EntrevistaReclutamiento;
      case CandidateApplicationStage.EntrevistaReclutamiento:
        return CandidateApplicationStage.EntrevistaOperaciones;
      case CandidateApplicationStage.EntrevistaOperaciones:
        return CandidateApplicationStage.Seleccionado;
      default:
        return this.getFirstAllowed(from);
    }
  }

  private getFirstAllowed(from: CandidateApplicationStage): number {
    const opts = this.resolveAllowedStages(from);
    return opts.length ? (opts[0].value as number) : -1;
  }

  async onLoadInterviewers(): Promise<void> {
    if (!this.requestPositionId || this.cb_interviewers().length > 0) return;
    this.loadingInterviewers.set(true);
    try {
      const interviewers = await this.apiResponseS.onGetItem<
        SelectItemDto[]
      >(
        EndpointsReclutamiento.InterviewerMatrix.eligibleInterviewersByRequestPosition(
          this.requestPositionId,
        ),
      );
      if (interviewers) {
        this.cb_interviewers.set(interviewers);
      }
    } finally {
      this.loadingInterviewers.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    const payload: ChangeStageApplicationRequest = {
      toStage: this.form.controls["toStage"].value,
      comment: this.form.controls["comment"].value ?? "",
      recruitmentInterviewAt: this.toIso(
        this.form.controls["recruitmentInterviewAt"].value,
      ),
      operationsInterviewAt: this.toIso(
        this.form.controls["operationsInterviewAt"].value,
      ),
      operationsInterviewAssignedToUserId:
        this.form.controls["operationsInterviewAssignedToUserId"].value,
    };

    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    try {
      const result = await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.changeStage(this.id),
        payload,
      );
      if (result) {
        this.ref.close(true);
        return;
      }
    } catch {
      // Error ya notificado por ApiResponseService
    } finally {
      this.submitting.set(false);
    }
  }

  private toIso(value: string | null): string | undefined {
    return value ? new Date(value).toISOString() : undefined;
  }
}
