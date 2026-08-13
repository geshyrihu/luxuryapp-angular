import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputDateTimeSignal } from "@ui/inputs/web/custom-input-date-time-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateRecruitmentInterviewsService } from "./candidate-recruitment-interviews.service";
import {
  CandidateRecruitmentInterviewBoardItem,
  RecruitmentBoardAction,
} from "./candidate-recruitment-interviews.interface";
import { ChangeStageApplicationRequest } from "../candidate-application/interfaces/candidate-application";

@Component({
  selector: "app-candidate-recruitment-schedule-modal",
  standalone: true,
  templateUrl: "./candidate-recruitment-schedule-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomInputDateSignal,
    CustomInputDateTimeSignal,
    WebButtonLabel,
    WebButtonLabelSave,
  ],
})
export class CandidateRecruitmentScheduleModal implements OnInit {
  readonly apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private boardS = inject(CandidateRecruitmentInterviewsService);

  readonly submitting = signal(false);
  readonly loadingInterviewers = signal(false);
  readonly cb_interviewers = signal<SelectItemDto[]>([]);

  readonly item: CandidateRecruitmentInterviewBoardItem =
    this.config.data.item;
  readonly action: RecruitmentBoardAction = this.config.data.action;
  readonly customerId: string = this.config.data.customerId;
  readonly requestPositionId: string = this.config.data.requestPositionId;
  readonly scheduleTargetId = this.item.candidateProcessId || this.item.candidateApplicationId;

  readonly form: FormGroup = new FormGroup({
    recruitmentInterviewAt: new FormControl<string | null>(null),
    operationsInterviewAt: new FormControl<string | null>(null),
    operationsInterviewAssignedToUserId: new FormControl<string | null>(null),
    comment: new FormControl<string | null>(null),
  });

  readonly title = computed(() => {
    switch (this.action) {
      case "send":
        return `Enviar a entrevista - ${this.item.candidateName}`;
      case "schedule":
        return `Agendar cita - ${this.item.candidateName}`;
      case "reschedule":
        return `Reagendar cita - ${this.item.candidateName}`;
      case "assign":
        return `Asignar entrevistador - ${this.item.candidateName}`;
      default:
        return "Gestionar entrevista";
    }
  });

  readonly submitLabel = computed(() => {
    switch (this.action) {
      case "send":
        return "Enviar a entrevista";
      case "schedule":
        return "Agendar cita";
      case "reschedule":
        return "Reagendar cita";
      case "assign":
        return "Asignar entrevistador";
      default:
        return "Guardar";
    }
  });

  readonly canCancelInterview = computed(() => {
    if (this.action === "send") return false;
    return !!(
      this.item.recruitmentInterviewAt || this.item.operationsInterviewAt
    );
  });

  ngOnInit(): void {
    this.form.controls["recruitmentInterviewAt"].setValue(
      this.toLocalInput(this.item.recruitmentInterviewAt),
    );
    this.form.controls["operationsInterviewAt"].setValue(
      this.toLocalInput(this.item.operationsInterviewAt),
    );
    this.form.controls["operationsInterviewAssignedToUserId"].setValue(
      this.item.assignedInterviewerUserId || null,
    );

    if (this.action === "assign") {
      this.form.controls["operationsInterviewAssignedToUserId"].setValidators(
        Validators.required,
      );
      this.form.controls["operationsInterviewAssignedToUserId"].updateValueAndValidity({
        emitEvent: false,
      });
      void this.onLoadInterviewers();
    }
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
      const options = interviewers ?? [];
      this.cb_interviewers.set(options);
      if (
        options.length > 0 &&
        !options.some(
          (item) =>
            item.value ===
            this.form.controls["operationsInterviewAssignedToUserId"].value,
        )
      ) {
        this.form.controls["operationsInterviewAssignedToUserId"].setValue(null);
      }
    } finally {
      this.loadingInterviewers.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isAssignActionBlocked()) return;
    this.submitting.set(true);
    try {
      const ok = await this.execute();
      if (ok) {
        this.ref.close(true);
        return;
      }
    } catch {
      // Error ya notificado por ApiResponseService
    } finally {
      this.submitting.set(false);
    }
  }

  isAssignActionBlocked(): boolean {
    return (
      this.action === "assign" &&
      (this.loadingInterviewers() ||
        this.cb_interviewers().length === 0 ||
        !this.form.controls["operationsInterviewAssignedToUserId"].value)
    );
  }

  async onCancelInterview(): Promise<void> {
    this.submitting.set(true);
    try {
      const ok = this.item.interviewId
        ? await this.boardS.cancelInterview(this.item.interviewId)
        : await this.boardS.cancelSchedule(
            this.scheduleTargetId,
            {
              comment: this.form.controls["comment"].value ?? "",
              cancelInterview: true,
            },
          );
      if (ok) {
        this.ref.close(true);
      }
    } catch {
      // Error ya notificado por ApiResponseService
    } finally {
      this.submitting.set(false);
    }
  }

  private async execute(): Promise<boolean> {
    const comment = this.form.controls["comment"].value ?? "";

    if (this.action === "send") {
      const payload: ChangeStageApplicationRequest = {
        toStage: CandidateApplicationStage.EntrevistaReclutamiento,
        comment,
        recruitmentInterviewAt: this.toIso(
          this.form.controls["recruitmentInterviewAt"].value,
        ),
      };
      return this.boardS.sendToInterview(this.scheduleTargetId, payload);
    }

    if (this.action === "reschedule" && this.item.interviewId) {
      const proposedDate =
        this.form.controls["operationsInterviewAt"].value ??
        this.form.controls["recruitmentInterviewAt"].value;

      if (!proposedDate) {
        return false;
      }

      return this.boardS.rescheduleInterview(this.item.interviewId, {
        proposedRescheduleAt: this.toIso(proposedDate) ?? "",
        rescheduleComment: comment,
      });
    }

    const schedulePayload = {
      recruitmentInterviewAt: this.toIso(
        this.form.controls["recruitmentInterviewAt"].value,
      ),
      operationsInterviewAt:
        this.action === "reschedule"
          ? this.toIso(this.form.controls["operationsInterviewAt"].value)
          : undefined,
      operationsInterviewAssignedToUserId:
        this.action === "assign"
          ? this.form.controls["operationsInterviewAssignedToUserId"].value
          : undefined,
      comment,
    };

    return this.boardS.schedule(this.scheduleTargetId, schedulePayload);
  }

  private toIso(value: string | null): string | undefined {
    return value ? new Date(value).toISOString() : undefined;
  }

  private toLocalInput(value?: string | null): string | null {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
}
