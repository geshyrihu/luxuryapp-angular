import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { firstValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateRejectionReason } from "src/app/core/enums/candidate-rejection-reason";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateInterviewFeedbackForm } from "src/app/shared/integration/reclutamiento/candidates/candidate-interview/candidate-interview-feedback-form";
import { CandidateInterviewResponseDto } from "src/app/shared/integration/reclutamiento/candidates/candidate-interview/interfaces/candidate-interview";
import { InterviewerActionRequestDto } from "src/app/shared/integration/reclutamiento/candidates/candidate-interview/interfaces/interviewer-action-request.dto";
import { AGENDA_STATUS_TAG_OPTIONS } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/agenda-status-tag-options";
import { CandidateStageBadge } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/candidate-stage-badge";
import { MappedPTag } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/mapped-p-tag";

@Component({
  selector: "app-employee-interview-response",
  templateUrl: "./employee-interview-response.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    TableModule,
    WebButtonLabel,
    WebButtonIconViewPdf,
    CustomInputSelectSignal,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class EmployeeInterviewResponse implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService);
  private toastS = inject(CustomToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly applicationId = computed(
    () => this.route.snapshot.queryParamMap.get("applicationId") ?? "",
  );
  readonly candidateProcessId = computed(
    () => this.route.snapshot.queryParamMap.get("candidateProcessId") ?? "",
  );

  readonly interviewData = signal<CandidateInterviewResponseDto | null>(null);
  readonly loading = signal(true);
  readonly actionLoading = signal(false);
  readonly showReasonModal = signal(false);
  readonly pendingAction = signal<"markNoShow" | "reject" | "approve" | null>(
    null,
  );
  readonly pendingDecision = signal<CandidateDecision | null>(null);
  readonly selectedReason = signal<number | null>(null);
  readonly agreedPresentationDate = signal<string | null>(null);
  readonly reasonOptions = signal<SelectItemDto[]>([]);
  readonly today = new Date().toISOString().split("T")[0];

  readonly agendaStatusOptions = AGENDA_STATUS_TAG_OPTIONS;

  ngOnInit(): void {
    void this.loadReasonOptions();

    const identifier =
      this.route.snapshot.queryParamMap.get("candidateProcessId") ??
      this.route.snapshot.queryParamMap.get("applicationId");

    if (identifier) {
      void this.loadInterviewResponse(identifier);
    } else {
      this.loading.set(false);
    }
  }

  private async loadInterviewResponse(identifier: string): Promise<void> {
    this.loading.set(true);
    try {
      const result =
        await this.apiResponseS.onGetItem<CandidateInterviewResponseDto>(
          EndpointsReclutamiento.CandidateProcesses.interviewResponse(
            identifier,
          ),
        );
      if (result) {
        this.interviewData.set(result);
      }
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(["/directory/employee-interviewer-queue"]);
  }

  openFeedbackModal(): void {
    const interviewData = this.interviewData();
    this.dialogHandlerS
      .openDialog(
        CandidateInterviewFeedbackForm,
        {
          candidateApplicationId:
            interviewData?.candidateApplicationId ?? this.applicationId(),
          candidateProcessId:
            interviewData?.candidateProcessId ?? this.candidateProcessId(),
        },
        "Retroalimentacion de entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.reloadInterviewResponse();
        }
      });
  }

  private async loadReasonOptions(): Promise<void> {
    this.reasonOptions.set(
      await firstValueFrom(this.enumSelectS.candidateRejectionReason()),
    );
  }

  private async openReasonModal(
    action: "markNoShow" | "reject" | "approve",
    decision: CandidateDecision,
  ): Promise<void> {
    this.pendingAction.set(action);
    this.pendingDecision.set(decision);
    this.selectedReason.set(null);
    this.showReasonModal.set(true);
  }

  closeReasonModal(): void {
    this.showReasonModal.set(false);
    this.pendingAction.set(null);
    this.pendingDecision.set(null);
    this.selectedReason.set(null);
    this.agreedPresentationDate.set(null);
  }

  async confirmAction(): Promise<void> {
    const action = this.pendingAction();
    const decision = this.pendingDecision();
    const decisionReason = this.selectedReason();
    const interviewData = this.interviewData();
    const candidateProcessId =
      interviewData?.candidateProcessId ?? this.candidateProcessId();

    if (!action || !decision) return;
    if (!candidateProcessId) {
      this.toastS.showWarn(
        "Proceso requerido",
        "La respuesta de entrevista ahora requiere un CandidateProcess activo.",
      );
      return;
    }
    const decisionValue = decision as CandidateDecision;
    if (
      decisionValue === CandidateDecision.Rechazado &&
      decisionReason === null
    )
      return;
    if (
      decisionValue === CandidateDecision.Aprobado &&
      !this.agreedPresentationDate()
    ) {
      this.toastS.showWarn(
        "Fecha requerida",
        "Debe indicar la Fecha de Presentación Acordada para aprobar.",
      );
      return;
    }

    this.actionLoading.set(true);
    try {
      const payload: InterviewerActionRequestDto = {
        candidateProcessId,
        decision,
        decisionReason:
          decision === CandidateDecision.Rechazado
            ? (decisionReason as CandidateRejectionReason | null)
            : null,
        additionalComment: "",
        newScheduledAt: null,
        agreedPresentationDate: this.agreedPresentationDate(),
      };

      await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.interviewerAction,
        payload,
      );

      this.closeReasonModal();
      this.reloadInterviewResponse();
    } finally {
      this.actionLoading.set(false);
    }
  }

  async onMarkNoShow(): Promise<void> {
    await this.openReasonModal("markNoShow", CandidateDecision.NoSePresento);
  }

  async onReject(): Promise<void> {
    await this.openReasonModal("reject", CandidateDecision.Rechazado);
  }

  async onApprove(): Promise<void> {
    await this.openReasonModal("approve", CandidateDecision.Aprobado);
  }

  private reloadInterviewResponse(): void {
    const identifier =
      this.interviewData()?.candidateProcessId ??
      this.candidateProcessId() ??
      this.applicationId();

    if (!identifier) return;
    void this.loadInterviewResponse(identifier);
  }
}
