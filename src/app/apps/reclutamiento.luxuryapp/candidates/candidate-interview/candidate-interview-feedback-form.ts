import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CandidateDecisionReasonSelect } from "../recruitment-shared/candidate-decision-reason-select";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { InterviewerActionType } from "src/app/core/enums/interviewer-action-type";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { candidateDecisionLabel } from "../recruitment-shared/candidate-decision-labels";
import { CandidateInterviewFeedbackFormDialogData } from "./interfaces/candidate-interview-feedback-form-dialog-data.interface";
import { CandidateInterviewResponseDto } from "./interfaces/candidate-interview-response.dto";
import { InterviewerActionRequestDto } from "./interfaces/interviewer-action-request.dto";

@Component({
  selector: "app-candidate-interview-feedback-form",
  standalone: true,
  templateUrl: "./candidate-interview-feedback-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CandidateDecisionReasonSelect,
    WebButtonLabelSave,
  ],
})
export class CandidateInterviewFeedbackForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly toastS = inject(CustomToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly resolvingProcess = signal(false);
  readonly cbDecision = signal<SelectItemDto[]>([]);
  readonly selectedDecision = signal<CandidateDecision | null>(null);

  readonly dialogData = (this.config.data ?? {}) as CandidateInterviewFeedbackFormDialogData;
  readonly candidateApplicationId = signal(this.dialogData.candidateApplicationId ?? "");
  readonly candidateProcessId = signal(this.dialogData.candidateProcessId ?? "");
  readonly targetLabel = computed(
    () => this.candidateProcessId() || this.candidateApplicationId(),
  );

  readonly form = new FormGroup({
    targetId: new FormControl({ value: "", disabled: true }),
    receptionConfirmedAt: new FormControl<string | null>(null),
    decision: new FormControl<number | null>(null, Validators.required),
    decisionReasonId: new FormControl<string | null>(null, Validators.required),
    additionalComment: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.form.patchValue({ targetId: this.targetLabel() });
    this.cbDecision.set(
      Object.keys(CandidateDecision)
        .filter((key) => Number.isNaN(Number(key)))
        .map((key) => {
          const decision =
            CandidateDecision[key as keyof typeof CandidateDecision] as CandidateDecision;
          return {
            label: candidateDecisionLabel(decision),
            value: decision as number,
          };
        }),
    );

    this.form.controls.decision.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.selectedDecision.set(value as CandidateDecision | null);
        this.form.controls.decisionReasonId.setValue(null);
      });

    await this.resolveCandidateProcessId();
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const candidateApplicationId = this.candidateApplicationId();
    const candidateProcessId = this.candidateProcessId();

    if (!candidateApplicationId || !candidateProcessId) {
      this.toastS.showWarn(
        "Proceso requerido",
        "La retroalimentacion ahora requiere un CandidateProcess activo.",
      );
      return;
    }

    const payload: InterviewerActionRequestDto = {
      candidateApplicationId,
      candidateProcessId,
      action: InterviewerActionType.SubmitFeedback,
      reasonId: this.form.controls.decisionReasonId.value ?? undefined,
      comment: this.form.controls.additionalComment.value ?? "",
      receptionConfirmedAt: this.toIso(
        this.form.controls.receptionConfirmedAt.value,
      ) ?? undefined,
    };

    const selectedDecision = this.form.controls.decision.value as CandidateDecision;
    if (
      selectedDecision === CandidateDecision.Aprobado ||
      selectedDecision === CandidateDecision.Rechazado ||
      selectedDecision === CandidateDecision.NoSePresento
    ) {
      payload.action = this.mapAction(selectedDecision);
    }

    this.submitting.set(true);
    try {
      const result = await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.interviewerAction,
        payload,
      );
      if (result) {
        this.ref.close(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  private async resolveCandidateProcessId(): Promise<void> {
    if (this.candidateProcessId() || !this.candidateApplicationId()) return;

    this.resolvingProcess.set(true);
    try {
      const result = await this.apiResponseS.onGetItem<CandidateInterviewResponseDto>(
        EndpointsReclutamiento.CandidateProcesses.interviewResponse(
          this.candidateApplicationId(),
        ),
        false,
      );
      if (result?.candidateProcessId) {
        this.candidateProcessId.set(result.candidateProcessId);
        this.form.patchValue({ targetId: result.candidateProcessId });
        return;
      }

      this.toastS.showWarn(
        "Proceso requerido",
        "La postulacion aun no tiene CandidateProcess para registrar retroalimentacion.",
      );
    } finally {
      this.resolvingProcess.set(false);
    }
  }

  private mapAction(decision: CandidateDecision): InterviewerActionType {
    switch (decision) {
      case CandidateDecision.Aprobado:
        return InterviewerActionType.Approve;
      case CandidateDecision.Rechazado:
        return InterviewerActionType.Reject;
      case CandidateDecision.NoSePresento:
        return InterviewerActionType.MarkNoShow;
      default:
        return InterviewerActionType.SubmitFeedback;
    }
  }

  private toIso(value: string | null): string | null {
    return value ? new Date(value).toISOString() : null;
  }
}
