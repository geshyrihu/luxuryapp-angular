import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  CandidateInterviewerQueueDto,
  CandidateInterviewerQueueItemDto,
} from "src/app/shared/integration/reclutamiento/candidates/candidate-interviewer-queue/interfaces/candidate-interviewer-queue.interface";
import { AGENDA_STATUS_TAG_OPTIONS } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/agenda-status-tag-options";
import { AppAvatar } from "src/app/shared/ui/web/avatar/avatar";
import { ConfirmPresentationModal } from "../staff-board/confirm-presentation-modal/confirm-presentation-modal";
import { EmployeeInterviewerQueueService } from "./employee-interviewer-queue.service";
import { EmployeeQueueCandidateDetailModal } from "./employee-queue-candidate-detail-modal";
import { VacancyCandidatesTimelineModal } from "./vacancy-candidates-timeline-modal";

type QueueCandidateView = CandidateInterviewerQueueItemDto & {
  vacancyFolio: string;
  positionName: string;
  customerName: string;
  vacancyStatus: string;
  requestPositionId: string;
};

type QueueVacancyView = CandidateInterviewerQueueDto & {
  filteredCandidates: QueueCandidateView[];
};

@Component({
  selector: "app-employee-interviewer-queue",
  templateUrl: "./employee-interviewer-queue.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, WebButtonLabel, AppAvatar],
})
export class EmployeeInterviewerQueue {
  private queueS = inject(EmployeeInterviewerQueueService);
  private dialogHandlerS = inject(DialogHandlerService);
  private toastS = inject(CustomToastService);
  readonly customerIdS = inject(CustomerIdService);

  readonly dataSignal = signal<CandidateInterviewerQueueDto[]>([]);
  readonly loading = signal(false);
  readonly searchTerm = signal("");

  readonly agendaStatusOptions = AGENDA_STATUS_TAG_OPTIONS;
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
        requestPositionId: vacancy.requestPositionId,
      })),
    ),
  );

  readonly filteredVacancies = computed<QueueVacancyView[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.dataSignal()
      .filter((vacancy) => {
        const status = (vacancy.vacancyStatus || "").toLowerCase();
        return status.includes("pendiente") || status.includes("proceso");
      })
      .map((vacancy) => ({
        ...vacancy,
        filteredCandidates: vacancy.candidates
          .map((candidate) => ({
            ...candidate,
            vacancyFolio: vacancy.vacancyFolio,
            positionName: vacancy.positionName,
            customerName: vacancy.customerName,
            vacancyStatus: vacancy.vacancyStatus,
            requestPositionId: vacancy.requestPositionId,
          }))
          .filter((candidate) => this.matchesSearch(candidate, term)),
      }))
      .filter((vacancy) => {
        if (vacancy.filteredCandidates.length > 0) return true;
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

  openVacancyTimeline(vacancy: QueueVacancyView): void {
    this.dialogHandlerS.openDialog(
      VacancyCandidatesTimelineModal,
      {
        requestPositionId: vacancy.requestPositionId,
        workPositionId: vacancy.workPositionId,
        vacancyFolio: vacancy.vacancyFolio,
        positionName: vacancy.positionName,
        customerName: vacancy.customerName,
      },
      `Línea de tiempo - ${vacancy.vacancyFolio}`,
      this.dialogHandlerS.sizeMd,
    );
  }

  confirmableCandidates(vacancy: QueueVacancyView): QueueCandidateView[] {
    return vacancy.filteredCandidates.filter(
      (candidate) => candidate.canConfirmPresentation,
    );
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

  openConfirmPresentationModal(candidate: QueueCandidateView): void {
    if (!candidate.candidateProcessId) return;
    this.dialogHandlerS
      .openDialog(
        ConfirmPresentationModal,
        {
          processId: candidate.candidateProcessId,
          candidateName: candidate.candidateName,
          vacancyFolio: candidate.vacancyFolio,
        },
        "Confirmar Ingreso del Candidato",
        this.dialogHandlerS.sizeMd,
      )
      .then(async (result: boolean) => {
        if (!result) return;

        await this.onLoadData();
        this.toastS.showSuccess(
          "Candidato confirmado",
          "Se notificó a Reclutamiento para procesar el Alta.",
        );
      });
  }
}
