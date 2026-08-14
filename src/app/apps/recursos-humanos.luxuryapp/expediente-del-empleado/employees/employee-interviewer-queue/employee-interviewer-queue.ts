import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import {
  CandidateInterviewerQueueDto,
  CandidateInterviewerQueueItemDto,
} from "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { candidateDecisionLabel } from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-decision-labels";
import { CandidateStageBadge } from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/candidate-stage-badge";
import {
  MappedPTag,
  MappedTagOption,
} from "src/app/apps/reclutamiento.luxuryapp/candidates/recruitment-shared/mapped-p-tag";
import { CandidateDecision } from "src/app/core/enums/candidate-decision";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EmployeeInterviewFeedbackForm } from "./employee-interview-feedback-form";
import { EmployeeInterviewerQueueService } from "./employee-interviewer-queue.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";

type QueueMode = "pending" | "history" | "overdue" | "feedback" | "all";

type QueueCandidateView = CandidateInterviewerQueueItemDto & {
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  vacancyStatus: string;
};

type QueueVacancyView = CandidateInterviewerQueueDto & {
  filteredCandidates: QueueCandidateView[];
};

@Component({
  selector: "app-employee-interviewer-queue",
  standalone: true,
  templateUrl: "./employee-interviewer-queue.html",
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
export class EmployeeInterviewerQueue {
  private queueS = inject(EmployeeInterviewerQueueService);
  private router = inject(Router);
  private dialogHandlerS = inject(DialogHandlerService);
  readonly customerIdS = inject(CustomerIdService);

  readonly dataSignal = signal<CandidateInterviewerQueueDto[]>([]);
  readonly loading = signal(false);
  readonly mode = signal<QueueMode>("pending");
  readonly searchTerm = signal("");
  readonly selectedCandidate = signal<QueueCandidateView | null>(null);

  readonly agendaStatusOptions = computed<MappedTagOption[]>(() => [
    {
      value: "missing_interviewer",
      label: "Sin entrevistador",
      severity: "warn",
    },
    {
      value: "pending_schedule",
      label: "Pendiente de agenda",
      severity: "contrast",
    },
    { value: "scheduled", label: "Agendada", severity: "info" },
    { value: "overdue", label: "Vencida", severity: "danger" },
    { value: "feedback", label: "Con retroalimentacion", severity: "success" },
    { value: "approved", label: "Aprobado", severity: "success" },
    { value: "rejected", label: "Rechazado", severity: "danger" },
    { value: "no_show", label: "No asistio", severity: "warn" },
  ]);

  readonly totalVacancies = computed(() => this.filteredVacancies().length);
  readonly totalCandidates = computed(() => this.flattenedCandidates().length);
  readonly pendingCount = computed(
    () =>
      this.flattenedCandidates().filter((candidate) => !candidate.isHistorical)
        .length,
  );
  readonly historyCount = computed(
    () =>
      this.flattenedCandidates().filter((candidate) => candidate.isHistorical)
        .length,
  );
  readonly overdueCount = computed(
    () =>
      this.flattenedCandidates().filter(
        (candidate) => candidate.agendaStatusCode === "overdue",
      ).length,
  );
  readonly feedbackCount = computed(
    () =>
      this.flattenedCandidates().filter(
        (candidate) => candidate.agendaStatusCode === "feedback",
      ).length,
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
    const mode = this.mode();

    return this.dataSignal()
      .map((vacancy) => ({
        ...vacancy,
        filteredCandidates: vacancy.candidates
          .map((candidate) => ({
            ...candidate,
            vacancyFolio: vacancy.vacancyFolio,
            positionName: vacancy.positionName,
            customerName: vacancy.customerName,
            vacancyStatus: vacancy.vacancyStatus,
          }))
          .filter(
            (candidate) =>
              this.matchesMode(candidate) &&
              this.matchesSearch(candidate, term),
          ),
      }))
      .filter((vacancy) => {
        // Si tiene candidatos filtrados, la mostramos
        if (vacancy.filteredCandidates.length > 0) return true;

        // Si no tiene candidatos, la mostramos si el modo es 'all' (todo) o 'pending' (para poder enviar feedback).
        // Y asegurarnos de que la vacante en sí coincida con la búsqueda si hay una
        if (mode === "all" || mode === "pending") {
          if (!term) return true;
          const vacancyHaystack = [
            vacancy.vacancyFolio,
            vacancy.positionName,
            vacancy.customerName,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return vacancyHaystack.includes(term);
        }
        return false;
      });
  });

  constructor() {
    effect(() => {
      if (this.customerIdS.customerId()) {
        void this.onLoadData();
      }
    });
  }

  async onLoadData(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    try {
      const data = await this.queueS.getQueue(customerId);
      this.dataSignal.set(data);

      const current = this.selectedCandidate();
      if (current) {
        const updated = this.flattenedCandidates().find(
          (candidate) =>
            candidate.candidateApplicationId === current.candidateApplicationId,
        );
        this.selectedCandidate.set(updated ?? null);
      } else {
        this.selectedCandidate.set(
          this.filteredVacancies()[0]?.filteredCandidates[0] ?? null,
        );
      }
    } finally {
      this.loading.set(false);
    }
  }

  setMode(mode: QueueMode): void {
    this.mode.set(mode);
    this.selectedCandidate.set(
      this.filteredVacancies()[0]?.filteredCandidates[0] ?? null,
    );
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? "";
    this.searchTerm.set(value);
    this.selectedCandidate.set(
      this.filteredVacancies()[0]?.filteredCandidates[0] ?? null,
    );
  }

  selectCandidate(candidate: QueueCandidateView): void {
    this.selectedCandidate.set(candidate);
  }

  navigateToQueueResponse(candidate: QueueCandidateView): void {
    this.router.navigate(["/directory/employee-interviews/respond"], {
      queryParams: {
        applicationId: candidate.candidateApplicationId,
        candidateProcessId: candidate.candidateProcessId ?? undefined,
      },
    });
  }

  async onFeedback(candidate: QueueCandidateView): Promise<void> {
    const result = await this.dialogHandlerS.openDialog<boolean>(
      EmployeeInterviewFeedbackForm,
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
    const confirmed = confirm(
      `Marcar a ${candidate.candidateName} como "No asistio"?`,
    );
    if (!confirmed) return;

    await this.queueS.executeAction({
      candidateApplicationId: candidate.candidateApplicationId,
      candidateProcessId: candidate.candidateProcessId ?? undefined,
      action: 1,
      comment: "No asistio a la entrevista programada.",
    });

    await this.onLoadData();
  }

  async onApprove(candidate: QueueCandidateView): Promise<void> {
    await this.queueS.executeAction({
      candidateApplicationId: candidate.candidateApplicationId,
      candidateProcessId: candidate.candidateProcessId ?? undefined,
      action: 3,
      comment: "Aprobado por entrevistador para continuar proceso.",
    });

    await this.onLoadData();
  }

  async onRevertDecision(candidate: QueueCandidateView): Promise<void> {
    const confirmed = confirm("¿Estás seguro de revertir la decisión? Esto regresará la entrevista a pendiente.");
    if (!confirmed) return;

    await this.queueS.executeAction({
      candidateApplicationId: candidate.candidateApplicationId,
      candidateProcessId: candidate.candidateProcessId ?? undefined,
      action: 4, // RevertDecision
      comment: "Decisión revertida por el entrevistador.",
    });

    await this.onLoadData();
  }

  decisionLabel(decision?: CandidateDecision): string {
    if (decision === undefined || decision === null) return "Sin decision";
    return candidateDecisionLabel(decision);
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
}
