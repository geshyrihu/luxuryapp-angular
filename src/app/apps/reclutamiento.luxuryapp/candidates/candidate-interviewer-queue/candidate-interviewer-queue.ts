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
import { Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CandidateInterviewerQueueService } from "./candidate-interviewer-queue.service";
import {
  CandidateInterviewerQueueDto,
  CandidateInterviewerQueueItemDto,
} from "./interfaces/candidate-interviewer-queue.interface";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { MappedPTag, MappedTagOption } from "../recruitment-shared/mapped-p-tag";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ConfirmService } from "src/app/shared/ui/buttons/shared/confirm.service";
import { CandidateInterviewFeedbackForm } from "../candidate-interview/candidate-interview-feedback-form";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { candidateDecisionLabel } from "../recruitment-shared/candidate-decision-labels";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { CustomToastService } from "src/app/core/services/custom-toast.service";


type QueueMode = "pending" | "history" | "overdue" | "feedback" | "all";

type QueueCandidateView = CandidateInterviewerQueueItemDto & {
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  vacancyStatus: string;
};

type QueueVacancyView = CandidateInterviewerQueueDto & {
  filteredCandidates: QueueCandidateView[];
  showWithoutCandidates: boolean;
};

@Component({
  selector: "app-candidate-interviewer-queue",
  standalone: true,
  templateUrl: "./candidate-interviewer-queue.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    WebButtonIconViewPdf,
    WebButtonLabel,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class CandidateInterviewerQueue implements OnInit {
  private interviewerQueueS = inject(CandidateInterviewerQueueService);
  private router = inject(Router);
  private dialogHandlerS = inject(DialogHandlerService);
  private confirmS = inject(ConfirmService);
  private toastS = inject(CustomToastService);

  readonly dataSignal = signal<CandidateInterviewerQueueDto[]>([]);
  readonly loading = signal(false);
  readonly mode = signal<QueueMode>("pending");
  readonly searchTerm = signal("");
  readonly selectedCandidate = signal<QueueCandidateView | null>(null);

  readonly agendaStatusOptions = computed<MappedTagOption[]>(() => [
    { value: "missing_interviewer", label: "Sin entrevistador", severity: "warn" },
    { value: "pending_schedule", label: "Pendiente de agenda", severity: "contrast" },
    { value: "scheduled", label: "Agendada", severity: "info" },
    { value: "overdue", label: "Vencida", severity: "danger" },
    { value: "feedback", label: "Con retroalimentacion", severity: "success" },
    { value: "approved", label: "Aprobado", severity: "success" },
    { value: "rejected", label: "Rechazado", severity: "danger" },
    { value: "no_show", label: "No asistio", severity: "warn" },
  ]);

  readonly totalVacancies = computed(() => this.dataSignal().length);
  readonly totalCandidates = computed(() =>
    this.dataSignal().reduce((sum, vacancy) => sum + vacancy.candidates.length, 0),
  );
  readonly pendingCount = computed(() =>
    this.flattenedCandidates().filter((candidate) => !candidate.isHistorical).length,
  );
  readonly historyCount = computed(() =>
    this.flattenedCandidates().filter((candidate) => candidate.isHistorical).length,
  );
  readonly overdueCount = computed(() =>
    this.flattenedCandidates().filter((candidate) => candidate.agendaStatusCode === "overdue").length,
  );
  readonly feedbackCount = computed(() =>
    this.flattenedCandidates().filter((candidate) => candidate.agendaStatusCode === "feedback").length,
  );

  readonly flattenedCandidates = computed<QueueCandidateView[]>(() =>
    this.dataSignal().flatMap((vacancy) =>
      vacancy.candidates.map((candidate) => ({
        ...candidate,
        vacancyFolio: vacancy.vacancyFolio,
        positionName: vacancy.positionName,
        customerName: vacancy.customerName,
        vacancyStatus: vacancy.vacancyStatus,
      })),
    ),
  );

  readonly filteredVacancies = computed<QueueVacancyView[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.dataSignal()
      .map((vacancy) => {
        const filteredCandidates = vacancy.candidates
          .map((candidate) => ({
            ...candidate,
            vacancyFolio: vacancy.vacancyFolio,
            positionName: vacancy.positionName,
            customerName: vacancy.customerName,
            vacancyStatus: vacancy.vacancyStatus,
          }))
          .filter((candidate) => this.matchesMode(candidate) && this.matchesSearch(candidate, term));

        const showWithoutCandidates =
          filteredCandidates.length === 0 &&
          vacancy.candidates.length === 0 &&
          this.matchesVacancyWithoutCandidates(vacancy, term);

        return {
          ...vacancy,
          filteredCandidates,
          showWithoutCandidates,
        };
      })
      .filter((vacancy) => vacancy.filteredCandidates.length > 0 || vacancy.showWithoutCandidates);
  });

  ngOnInit(): void {
    void this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.interviewerQueueS.getInterviewerQueue();
      this.dataSignal.set(data);

      const current = this.selectedCandidate();
      if (current) {
        const updated = this.flattenedCandidates().find(
          (candidate) => candidate.candidateApplicationId === current.candidateApplicationId,
        );
        this.selectedCandidate.set(updated ?? null);
      } else {
        this.selectedCandidate.set(this.filteredVacancies()[0]?.filteredCandidates[0] ?? null);
      }
    } finally {
      this.loading.set(false);
    }
  }

  setMode(mode: QueueMode): void {
    this.mode.set(mode);
    this.selectedCandidate.set(this.filteredVacancies()[0]?.filteredCandidates[0] ?? null);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? "";
    this.searchTerm.set(value);
    this.selectedCandidate.set(this.filteredVacancies()[0]?.filteredCandidates[0] ?? null);
  }

  selectCandidate(candidate: QueueCandidateView): void {
    this.selectedCandidate.set(candidate);
  }

  navigateToQueueResponse(candidate: QueueCandidateView): void {
    this.router.navigate(ROUTES.RECLUTAMIENTO.CANDIDATOS_ENTREVISTAS_RESPONDER, {
      queryParams: {
        applicationId: candidate.candidateApplicationId,
        candidateProcessId: candidate.candidateProcessId ?? undefined,
      },
    });
  }

  navigateToApplicationDetail(candidateApplicationId: string): void {
    this.router.navigate(ROUTES.RECLUTAMIENTO.CANDIDATOS_APLICACIONES, {
      queryParams: { detail: candidateApplicationId },
    });
  }

  async onFeedback(candidate: QueueCandidateView): Promise<void> {
    const result = await this.dialogHandlerS.openDialog<boolean>(
      CandidateInterviewFeedbackForm,
      {
        candidateApplicationId: candidate.candidateApplicationId,
        candidateProcessId: candidate.candidateProcessId ?? undefined,
      },
      `Retroalimentacion - ${candidate.candidateName}`,
      DialogSize.lg,
    );
    if (result) {
      await this.onLoadData();
    }
  }

  async onMarkNoShow(candidate: QueueCandidateView): Promise<void> {
    if (!candidate.candidateProcessId) {
      this.toastS.showWarn(
        "Proceso requerido",
        "El candidato no tiene un proceso activo para responder esta entrevista.",
      );
      return;
    }

    const confirmed = await this.confirmS.confirm(`Marcar a ${candidate.candidateName} como "No asistio"?`);
    if (!confirmed) return;

    await this.interviewerQueueS.executeAction({
      candidateProcessId: candidate.candidateProcessId,
      decision: CandidateDecision.NoSePresento,
      additionalComment: "No asistio a la entrevista programada.",
    });

    await this.onLoadData();
  }

  async onApprove(candidate: QueueCandidateView): Promise<void> {
    if (!candidate.candidateProcessId) {
      this.toastS.showWarn(
        "Proceso requerido",
        "El candidato no tiene un proceso activo para responder esta entrevista.",
      );
      return;
    }

    await this.interviewerQueueS.executeAction({
      candidateProcessId: candidate.candidateProcessId,
      decision: CandidateDecision.Aprobado,
      additionalComment: "Aprobado por entrevistador para continuar proceso.",
    });

    await this.onLoadData();
  }

  decisionLabel(decision?: CandidateDecision): string {
    if (decision === undefined || decision === null) return "Sin decision";
    return candidateDecisionLabel(decision);
  }

  hasQueueDataForStaffBoard(): boolean {
    return this.totalVacancies() > 0;
  }

  private matchesMode(candidate: QueueCandidateView): boolean {
    switch (this.mode()) {
      case "pending":
        return !candidate.isHistorical;
      case "history":
        return candidate.isHistorical;
      case "overdue":
        return candidate.agendaStatusCode === "overdue";
      case "feedback":
        return candidate.agendaStatusCode === "feedback";
      default:
        return true;
    }
  }

  private matchesSearch(candidate: QueueCandidateView, term: string): boolean {
    if (!term) return true;

    const haystack = [
      candidate.candidateName,
      candidate.vacancyFolio,
      candidate.positionName,
      candidate.customerName,
      candidate.agendaStatusLabel,
      candidate.assignedInterviewerName,
      candidate.pendingAction,
      candidate.interviewTypeLabel,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  }

  private matchesVacancyWithoutCandidates(
    vacancy: CandidateInterviewerQueueDto,
    term: string,
  ): boolean {
    if (!(this.mode() === "pending" || this.mode() === "all")) return false;

    if (!term) return true;

    const haystack = [
      vacancy.vacancyFolio,
      vacancy.positionName,
      vacancy.customerName,
      vacancy.vacancyStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  }
}




