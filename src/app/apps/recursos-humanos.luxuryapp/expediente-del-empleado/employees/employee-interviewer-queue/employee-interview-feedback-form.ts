import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CandidateDecisionReasonSelect } from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-decision-reason-select";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { candidateDecisionLabel } from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-decision-labels";
import { CandidateInterviewFeedbackCreate } from "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/interfaces/candidate-interview";

@Component({
  selector: "app-employee-interview-feedback-form",
  standalone: true,
  templateUrl: "./employee-interview-feedback-form.html",
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
export class EmployeeInterviewFeedbackForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  cb_decision = signal<SelectItemDto[]>([]);
  selectedDecision = signal<CandidateDecision | null>(null);

  candidateApplicationId: string | undefined = this.config.data.candidateApplicationId;
  candidateProcessId: string | undefined = this.config.data.candidateProcessId;

  form: FormGroup = new FormGroup({
    candidateApplicationId: new FormControl({ value: "", disabled: true }),
    receptionConfirmedAt: new FormControl<string | null>(null),
    interviewAt: new FormControl<string | null>(null),
    decision: new FormControl<number | null>(null, Validators.required),
    decisionReasonId: new FormControl<string | null>(null, Validators.required),
    additionalComment: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.form.patchValue({
      candidateApplicationId: this.candidateApplicationId ?? this.candidateProcessId ?? "",
    });

    this.cb_decision.set(
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

    this.form.controls["decision"].valueChanges.subscribe((value) => {
      this.selectedDecision.set(value as CandidateDecision | null);
      this.form.controls["decisionReasonId"].setValue(null);
    });
  }

  async onSubmit(): Promise<void> {
    const decision = this.form.controls["decision"].value as number;
    const payload: CandidateInterviewFeedbackCreate = {
      candidateApplicationId: this.candidateApplicationId ?? "",
      candidateProcessId: this.candidateProcessId,
      receptionConfirmedAt: this.toIso(this.form.controls["receptionConfirmedAt"].value),
      interviewAt: this.toIso(this.form.controls["interviewAt"].value),
      decision: decision as CandidateDecision,
      decisionReasonId: this.form.controls["decisionReasonId"].value,
      additionalComment: this.form.controls["additionalComment"].value ?? "",
    };

    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    try {
      const result = await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateInterviews.submitFeedback,
        payload,
      );

      if (result) {
        this.ref.close(true);
        return;
      }
    } finally {
      this.submitting.set(false);
    }
  }

  private toIso(value: string | null): string | null {
    return value ? new Date(value).toISOString() : null;
  }
}
