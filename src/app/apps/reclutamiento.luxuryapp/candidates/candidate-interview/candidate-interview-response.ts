import { ROUTES } from "src/app/routing/route-paths";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";
import { CandidateInterviewResponseDto, CandidateDecisionReasonItem } from "./interfaces/candidate-interview";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { FormsModule } from "@angular/forms";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { MappedPTag, MappedTagOption } from "../recruitment-shared/mapped-p-tag";

@Component({
  selector: "app-candidate-interview-response",
  standalone: true,
  templateUrl: "./candidate-interview-response.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    WebButtonLabel,
    WebButtonIconViewPdf,
    TableModule,
    CandidateStageBadge,
    MappedPTag,
    CustomInputSelectSignal,
    FormsModule,
  ],
})
export class CandidateInterviewResponse implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // ID de la aplicación a responder (desde query param)
  readonly applicationId = computed(
    () => this.route.snapshot.queryParamMap.get("applicationId") ?? "",
  );
  readonly candidateProcessId = computed(
    () => this.route.snapshot.queryParamMap.get("candidateProcessId") ?? "",
  );

  // Datos de la entrevista
  readonly interviewData = signal<CandidateInterviewResponseDto | null>(null);
  readonly loading = signal(true);
  readonly actionLoading = signal(false);
  readonly showReasonModal = signal(false);
  readonly pendingAction = signal<"markNoShow" | "reject" | "approve" | null>(null);
  readonly selectedReasonId = signal<string | null>(null);
  readonly reasonOptions = signal<CandidateDecisionReasonItem[]>([]);

  readonly agendaStatusOptions = computed<MappedTagOption[]>(() => [
    { value: "PENDIENTE", label: "Pendiente", severity: "warn" },
    { value: "CONFIRMADO", label: "Confirmado", severity: "info" },
    { value: "REALIZADA", label: "Realizada", severity: "success" },
    { value: "CANCELADA", label: "Cancelada", severity: "danger" },
    { value: "NO_ASISTIO", label: "No asistió", severity: "danger" },
    { value: "REPROGRAMADA", label: "Reprogramada", severity: "secondary" },
  ]);

  ngOnInit(): void {
    const identifier =
      this.route.snapshot.queryParamMap.get("candidateProcessId") ??
      this.route.snapshot.queryParamMap.get("applicationId");
    if (identifier) {
      this.loadInterviewResponse(identifier);
    } else {
      this.loading.set(false);
    }
  }

  private async loadInterviewResponse(applicationId: string): Promise<void> {
    this.loading.set(true);
    try {
      const result =
        await this.apiResponseS.onGetItem<CandidateInterviewResponseDto>(
          EndpointsReclutamiento.CandidateProcesses.interviewResponse(applicationId),
        );
      if (result) {
        this.interviewData.set(result);
      }
    } catch {
      // Error manejado por ApiResponseService
    } finally {
      this.loading.set(false);
    }
  }

  /** Volver a la bandeja de entrevistas */
  goBack(): void {
    this.router.navigate(ROUTES.RECLUTAMIENTO.CANDIDATOS_ENTREVISTAS);
  }

  /** Abrir modal de feedback */
  openFeedbackModal(): void {
    const interviewData = this.interviewData();
    this.dialogHandlerS
      .openDialog(
        CandidateInterviewFeedbackForm,
        {
          candidateApplicationId: interviewData?.candidateApplicationId ?? this.applicationId(),
          candidateProcessId: interviewData?.candidateProcessId ?? this.candidateProcessId(),
        },
        "Retroalimentación de entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.reloadInterviewResponse();
        }
      });
  }

  /** Obtener motivos de decisión según la acción */
  private async loadReasonOptions(decision: CandidateDecision): Promise<void> {
    try {
      const result = await this.apiResponseS.onGetList<CandidateDecisionReasonItem[]>(
        `${EndpointsReclutamiento.CandidateDecisionReasons.catalog}?decision=${decision}&activeOnly=true`,
      );
      if (result) {
        this.reasonOptions.set(result);
      }
    } catch {
      // Error manejado por ApiResponseService
    }
  }

  /** Abrir modal de confirmación con selección de motivo */
  private async openReasonModal(
    action: "markNoShow" | "reject" | "approve",
    decision: CandidateDecision,
    title: string,
  ): Promise<void> {
    await this.loadReasonOptions(decision);
    this.pendingAction.set(action);
    this.showReasonModal.set(true);
  }

  /** Cerrar modal de motivo */
  closeReasonModal(): void {
    this.showReasonModal.set(false);
    this.pendingAction.set(null);
    this.selectedReasonId.set(null);
  }

  /** Confirmar acción con motivo seleccionado */
  async confirmAction(): Promise<void> {
    const action = this.pendingAction();
    const reasonId = this.selectedReasonId();
    const interviewData = this.interviewData();
    const candidateApplicationId =
      interviewData?.candidateApplicationId ?? this.applicationId();
    const candidateProcessId =
      interviewData?.candidateProcessId ?? this.candidateProcessId();

    if (!action || (!candidateApplicationId && !candidateProcessId)) return;

    // Validar motivo para rechazar y no-show
    if ((action === "reject" || action === "markNoShow") && !reasonId) {
      return;
    }

    this.actionLoading.set(true);
    try {
      const actionMap: Record<string, string> = {
        markNoShow: "MarkNoShow",
        reject: "Reject",
        approve: "Approve",
      };

      const payload = {
        candidateApplicationId,
        candidateProcessId: candidateProcessId || undefined,
        action: actionMap[action],
        reasonId: reasonId ? reasonId : undefined,
        comment: "",
      };

      await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.CandidateProcesses.interviewerAction,
        payload,
      );

      this.closeReasonModal();
      this.reloadInterviewResponse();
    } catch {
      // Error manejado por ApiResponseService
    } finally {
      this.actionLoading.set(false);
    }
  }

  /** Marcar no asistió */
  async onMarkNoShow(): Promise<void> {
    await this.openReasonModal("markNoShow", CandidateDecision.NoSePresento, "Marcar no asistencia");
  }

  /** Rechazar */
  async onReject(): Promise<void> {
    await this.openReasonModal("reject", CandidateDecision.Rechazado, "Rechazar candidato");
  }

  /** Aprobar / Continuar */
  async onApprove(): Promise<void> {
    await this.openReasonModal("approve", CandidateDecision.Aprobado, "Aprobar / Continuar");
  }

  private reloadInterviewResponse(): void {
    const identifier =
      this.interviewData()?.candidateProcessId ??
      this.candidateProcessId() ??
      this.applicationId();
    if (!identifier) return;
    this.loadInterviewResponse(identifier);
  }
}

