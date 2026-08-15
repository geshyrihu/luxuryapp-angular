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
import {
  CandidateDecisionReasonItem,
  CandidateInterviewResponseDto,
} from "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interview/interfaces/candidate-interview";
import { CandidateStageBadge } from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-stage-badge";
import {
  MappedPTag,
  MappedTagOption,
} from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/mapped-p-tag";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EmployeeInterviewFeedbackForm } from "./employee-interview-feedback-form";

@Component({
  selector: "app-employee-interview-response",
  standalone: true,
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
  readonly selectedReasonId = signal<string | null>(null);
  readonly reasonOptions = signal<CandidateDecisionReasonItem[]>([]);

  readonly agendaStatusOptions = computed<MappedTagOption[]>(() => [
    { value: "PENDIENTE", label: "Pendiente", severity: "warn" },
    { value: "CONFIRMADO", label: "Confirmado", severity: "info" },
    { value: "REALIZADA", label: "Realizada", severity: "success" },
    { value: "CANCELADA", label: "Cancelada", severity: "danger" },
    { value: "NO_ASISTIO", label: "No asistio", severity: "danger" },
    { value: "REPROGRAMADA", label: "Reprogramada", severity: "secondary" },
  ]);

  ngOnInit(): void {
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
        EmployeeInterviewFeedbackForm,
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

  private async loadReasonOptions(decision: CandidateDecision): Promise<void> {
    const result = await this.apiResponseS.onGetList<
      CandidateDecisionReasonItem[]
    >(
      `${EndpointsReclutamiento.CandidateDecisionReasons.catalog}?decision=${decision}&activeOnly=true`,
    );
    if (result) {
      this.reasonOptions.set(result);
    }
  }

  private async openReasonModal(
    action: "markNoShow" | "reject" | "approve",
    decision: CandidateDecision,
  ): Promise<void> {
    await this.loadReasonOptions(decision);
    this.pendingAction.set(action);
    this.showReasonModal.set(true);
  }

  closeReasonModal(): void {
    this.showReasonModal.set(false);
    this.pendingAction.set(null);
    this.selectedReasonId.set(null);
  }

  async confirmAction(): Promise<void> {
    const action = this.pendingAction();
    const reasonId = this.selectedReasonId();
    const interviewData = this.interviewData();
    const candidateApplicationId =
      interviewData?.candidateApplicationId ?? this.applicationId();
    const candidateProcessId =
      interviewData?.candidateProcessId ?? this.candidateProcessId();

    if (!action || (!candidateApplicationId && !candidateProcessId)) return;
    if ((action === "reject" || action === "markNoShow") && !reasonId) return;

    this.actionLoading.set(true);
    try {
      const actionMap: Record<string, string> = {
        markNoShow: "MarkNoShow",
        reject: "Reject",
        approve: "Approve",
      };

      await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.interviewerAction,
        {
          candidateApplicationId,
          candidateProcessId: candidateProcessId || undefined,
          action: actionMap[action],
          reasonId: reasonId || undefined,
          comment: "",
        },
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
