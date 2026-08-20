import { CommonModule, DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";
import {
  ButtonGroupOption,
  IlButtonGroup,
} from "src/app/shared/ui/buttons/button-group/button-group";
import {
  CandidateInterviewerQueueDto,
  CandidateInterviewerQueueItemDto,
} from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { CandidateStageBadge } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/candidate-stage-badge";
import { MappedPTag } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/mapped-p-tag";
import { AGENDA_STATUS_TAG_OPTIONS } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/agenda-status-tag-options";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EmployeeQueueCandidateDetailModal } from "./employee-queue-candidate-detail-modal";
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

const MODE_OPTIONS: ButtonGroupOption<QueueMode>[] = [
  { label: "Pendientes", value: "pending" },
  { label: "Historico", value: "history" },
  { label: "Vencidas", value: "overdue" },
  { label: "Con feedback", value: "feedback" },
  { label: "Todo", value: "all" },
];

@Component({
  selector: "app-employee-interviewer-queue",
  standalone: true,
  templateUrl: "./employee-interviewer-queue.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    IlButtonGroup,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class EmployeeInterviewerQueue {
  private queueS = inject(EmployeeInterviewerQueueService);
  private dialogHandlerS = inject(DialogHandlerService);
  readonly customerIdS = inject(CustomerIdService);

  readonly dataSignal = signal<CandidateInterviewerQueueDto[]>([]);
  readonly loading = signal(false);
  readonly mode = signal<QueueMode>("pending");
  readonly searchTerm = signal("");

  readonly agendaStatusOptions = AGENDA_STATUS_TAG_OPTIONS;
  readonly modeOptions = MODE_OPTIONS;

  readonly totalVacancies = computed(() => this.filteredVacancies().length);
  readonly totalCandidates = computed(() => this.flattenedCandidates().length);
  readonly pendingCount = computed(
    () =>
      this.flattenedCandidates().filter((candidate) => !candidate.isHistorical)
        .length,
  );
  readonly overdueCount = computed(
    () =>
      this.flattenedCandidates().filter(
        (candidate) => candidate.agendaStatusCode === "overdue",
      ).length,
  );
  readonly historyCount = computed(
    () =>
      this.flattenedCandidates().filter((candidate) => candidate.isHistorical)
        .length,
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
    } finally {
      this.loading.set(false);
    }
  }

  setMode(mode: QueueMode): void {
    this.mode.set(mode);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? "";
    this.searchTerm.set(value);
  }

  openCandidateDetail(candidate: QueueCandidateView): void {
    this.dialogHandlerS
      .openDialog<boolean>(
        EmployeeQueueCandidateDetailModal,
        {
          candidateId: candidate.candidateId,
          candidateApplicationId: candidate.candidateApplicationId,
          candidateProcessId: candidate.candidateProcessId ?? undefined,
          canRespond: candidate.canSubmitFeedback,
          pendingAction: candidate.pendingAction,
        },
        candidate.candidateName,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
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
