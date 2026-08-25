import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { firstValueFrom } from "rxjs";
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
import { CustomInputDateTimeSignal } from "@ui/inputs/web/custom-input-date-time-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTime } from "@ui/inputs/web/custom-input-time-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateRejectionReason } from "src/app/core/enums/candidate-rejection-reason";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
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
    CustomInputDateTimeSignal,
    CustomInputDateSignal,
    CustomInputTime,
    CustomInputTextSignal,
    WebButtonLabelSave,
  ],
})
export class CandidateInterviewFeedbackForm implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly toastS = inject(CustomToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly enumSelectS = inject(EnumSelectService);

  readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);

  readonly submitting = signal(false);
  readonly resolvingProcess = signal(false);
  readonly cbDecision = signal<SelectItemDto[]>([]);
  readonly rejectionReasonOptions = signal<SelectItemDto[]>([]);
  readonly selectedDecision = signal<CandidateDecision | null>(null);

  readonly dialogData = (this.config.data ?? {}) as CandidateInterviewFeedbackFormDialogData;
  readonly candidateApplicationId = signal(this.dialogData.candidateApplicationId ?? "");
  readonly candidateProcessId = signal(this.dialogData.candidateProcessId ?? "");
  readonly targetLabel = computed(
    () => this.candidateProcessId() || this.candidateApplicationId(),
  );

  readonly form = new FormGroup({
    targetId: new FormControl({ value: "", disabled: true }),
    decision: new FormControl<number | null>(null, Validators.required),
    decisionReason: new FormControl<number | null>(null),
    additionalComment: new FormControl<string | null>(null),
    newScheduledAt: new FormControl<string | null>(null),
    agreedPresentationDate: new FormControl<string | null>(null),
    agreedPresentationTime: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.form.patchValue({ targetId: this.targetLabel() });
    this.rejectionReasonOptions.set(
      await firstValueFrom(this.enumSelectS.candidateRejectionReason()),
    );
    this.cbDecision.set(
      Object.keys(CandidateDecision)
        .filter((key) => Number.isNaN(Number(key)))
        .map((key) => {
          const decision =
            CandidateDecision[key as keyof typeof CandidateDecision] as CandidateDecision;
          return {
            label: candidateDecisionLabel(decision),
            value: decision,
          };
        }),
    );

    this.form.controls.decision.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((decision) => {
        this.selectedDecision.set(decision);
        if (decision === CandidateDecision.Rechazado) {
          this.form.controls.decisionReason.setValidators([
            Validators.required,
          ]);
        } else {
          this.form.controls.decisionReason.clearValidators();
          this.form.controls.decisionReason.setValue(null);
        }

        if (decision === CandidateDecision.Reprogramar) {
          this.form.controls.newScheduledAt.setValidators([
            Validators.required,
          ]);
        } else {
          this.form.controls.newScheduledAt.clearValidators();
          this.form.controls.newScheduledAt.setValue(null);
        }

        if (decision === CandidateDecision.Aprobado) {
          this.form.controls.agreedPresentationDate.setValidators([
            Validators.required,
          ]);
          this.form.controls.agreedPresentationTime.setValidators([
            Validators.required,
          ]);
        } else {
          this.form.controls.agreedPresentationDate.clearValidators();
          this.form.controls.agreedPresentationDate.setValue(null);
          this.form.controls.agreedPresentationTime.clearValidators();
          this.form.controls.agreedPresentationTime.setValue(null);
        }

        this.form.controls.decisionReason.updateValueAndValidity();
        this.form.controls.newScheduledAt.updateValueAndValidity();
        this.form.controls.agreedPresentationDate.updateValueAndValidity();
        this.form.controls.agreedPresentationTime.updateValueAndValidity();
      });

    await this.resolveCandidateProcessId();
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const candidateProcessId = this.candidateProcessId();

    if (!candidateProcessId) {
      this.toastS.showWarn(
        "Proceso requerido",
        "La retroalimentacion ahora requiere un CandidateProcess activo.",
      );
      return;
    }

    const selectedDecision = this.form.controls.decision.value as CandidateDecision;
    const payload: InterviewerActionRequestDto = {
      candidateProcessId,
      decision: selectedDecision,
      decisionReason:
        selectedDecision === CandidateDecision.Rechazado
          ? (this.form.controls.decisionReason.value as CandidateRejectionReason | null)
          : null,
      additionalComment: this.form.controls.additionalComment.value ?? "",
      newScheduledAt:
        selectedDecision === CandidateDecision.Reprogramar
          ? (this.toIso(this.form.controls.newScheduledAt.value) ?? null)
          : null,
      agreedPresentationDate:
        selectedDecision === CandidateDecision.Aprobado
          ? (this.toDateOnlyLocal(this.form.controls.agreedPresentationDate.value) ?? null)
          : null,
      agreedPresentationTime:
        selectedDecision === CandidateDecision.Aprobado
          ? this.form.controls.agreedPresentationTime.value
          : null,
    };

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

  private toIso(value: string | null): string | null {
    return value ? new Date(value).toISOString() : null;
  }

  private toDateOnlyLocal(value: string | null): string | null {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
