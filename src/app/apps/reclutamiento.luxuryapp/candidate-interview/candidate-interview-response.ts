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
import { ROUTES } from "src/app/routing/route-paths";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { AGENDA_STATUS_TAG_OPTIONS } from "../recruitment-shared/agenda-status-tag-options";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { MappedPTag } from "../recruitment-shared/mapped-p-tag";
import { CandidateInterviewFeedbackForm } from "./candidate-interview-feedback-form";
import { CandidateInterviewResponseDto } from "./interfaces/candidate-interview-response.dto";
import { InterviewerActionRequestDto } from "./interfaces/interviewer-action-request.dto";

@Component({
  selector: "app-candidate-interview-response",
  templateUrl: "./candidate-interview-response.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
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
  private enumSelectS = inject(EnumSelectService);
  private toastS = inject(CustomToastService);
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
  readonly pendingAction = signal<"markNoShow" | "reject" | "approve" | null>(
    null,
  );
  readonly pendingDecision = signal<CandidateDecision | null>(null);
  readonly selectedReason = signal<number | null>(null);
  readonly reasonOptions = signal<SelectItemDto[]>([]);

  readonly agendaStatusOptions = AGENDA_STATUS_TAG_OPTIONS;

  ngOnInit(): void {
    void this.loadReasonOptions();

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
          EndpointsReclutamiento.CandidateProcesses.interviewResponse(
            applicationId,
          ),
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

  /** Abrir modal process-first de feedback */
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
        "Retroalimentación de entrevista",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.reloadInterviewResponse();
        }
      });
  }

  /** Obtener motivos de rechazo desde el hub central de enums */
  private async loadReasonOptions(): Promise<void> {
    this.reasonOptions.set(
      await firstValueFrom(this.enumSelectS.candidateRejectionReason()),
    );
  }

  /** Abrir modal de confirmación con selección de motivo */
  private async openReasonModal(
    action: "markNoShow" | "reject" | "approve",
    decision: CandidateDecision,
  ): Promise<void> {
    this.pendingAction.set(action);
    this.pendingDecision.set(decision);
    this.selectedReason.set(null);
    this.showReasonModal.set(true);
  }

  /** Cerrar modal de motivo */
  closeReasonModal(): void {
    this.showReasonModal.set(false);
    this.pendingAction.set(null);
    this.pendingDecision.set(null);
    this.selectedReason.set(null);
  }

  /** Confirmar acción con motivo seleccionado */
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

    if (decision === CandidateDecision.Rechazado && decisionReason === null) {
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
    await this.openReasonModal("markNoShow", CandidateDecision.NoSePresento);
  }

  /** Rechazar */
  async onReject(): Promise<void> {
    await this.openReasonModal("reject", CandidateDecision.Rechazado);
  }

  /** Aprobar / Continuar */
  async onApprove(): Promise<void> {
    await this.openReasonModal("approve", CandidateDecision.Aprobado);
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
