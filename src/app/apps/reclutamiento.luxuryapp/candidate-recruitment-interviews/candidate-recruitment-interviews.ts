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
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { MappedPTag, MappedTagOption } from "../recruitment-shared/mapped-p-tag";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { CandidateRecruitmentInterviewsService } from "./candidate-recruitment-interviews.service";
import { CandidateRecruitmentScheduleModal } from "./candidate-recruitment-schedule-modal";
import { CandidateProcessHiringModal } from "../candidate-application/candidate-process-hiring-modal";
import { CandidateInterviewDetailModal } from "../candidate/candidate-interview-detail-modal";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import {
  CandidateRecruitmentInterviewBoard,
  CandidateRecruitmentInterviewBoardItem,
  RecruitmentBoardAction,
} from "./candidate-recruitment-interviews.interface";
import { RecruitmentAgendaList } from "../recruitment-agenda-list";

type BoardStatusFilter =
  | ""
  | "postulada"
  | "pending_schedule"
  | "missing_interviewer"
  | "scheduled"
  | "overdue"
  | "feedback"
  | "closed";

type InterviewViewMode = "board" | "agenda";

@Component({
  selector: "app-candidate-recruitment-interviews",
  standalone: true,
  templateUrl: "./candidate-recruitment-interviews.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    WebButtonIconViewPdf,
    WebButtonLabel,
    CandidateStageBadge,
    MappedPTag,
    RecruitmentAgendaList,
  ],
})
export class CandidateRecruitmentInterviews implements OnInit {
  private boardS = inject(CandidateRecruitmentInterviewsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly dataSignal = signal<CandidateRecruitmentInterviewBoard[]>([]);
  readonly loading = signal(false);
  readonly statusFilter = signal<BoardStatusFilter>("");
  readonly searchTerm = signal("");
  readonly focusedRequestPositionId = signal("");
  readonly focusedCandidateApplicationId = signal("");
  readonly viewMode = signal<InterviewViewMode>("board");

  readonly agendaStatusOptions: MappedTagOption[] = [
    { value: "postulada", label: "Postulada", severity: "secondary" },
    { value: "pending_schedule", label: "Pendiente de agenda", severity: "contrast" },
    { value: "missing_interviewer", label: "Sin entrevistador", severity: "warn" },
    { value: "scheduled", label: "Agendada", severity: "info" },
    { value: "overdue", label: "Vencida", severity: "danger" },
    { value: "feedback", label: "Con feedback", severity: "success" },
    { value: "closed", label: "Cerrada/Historica", severity: "secondary" },
  ];

  readonly totalVacancies = computed(() => this.dataSignal().length);
  readonly totalCandidates = computed(() =>
    this.dataSignal().reduce((sum, v) => sum + v.candidates.length, 0),
  );
  readonly pendingSend = computed(() =>
    this.dataSignal().reduce((sum, v) => sum + v.pendingInterviewCount, 0),
  );
  readonly scheduled = computed(() =>
    this.dataSignal().reduce((sum, v) => sum + v.scheduledCount, 0),
  );
  readonly overdue = computed(() =>
    this.dataSignal().reduce((sum, v) => sum + v.overdueCount, 0),
  );

  readonly filteredVacancies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const filter = this.statusFilter();

    return this.dataSignal()
      .filter((vacancy) =>
        !this.focusedRequestPositionId() ||
        vacancy.requestPositionId === this.focusedRequestPositionId(),
      )
      .map((vacancy) => {
        const filteredCandidates = vacancy.candidates.filter(
          (c) =>
            (!this.focusedCandidateApplicationId() ||
              c.candidateApplicationId === this.focusedCandidateApplicationId()) &&
            (filter === "" || c.agendaStatusCode === filter) &&
            this.matchesSearch(c, term),
        );
        return { ...vacancy, filteredCandidates };
      })
      .filter((v) => v.filteredCandidates.length > 0);
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.focusedRequestPositionId.set(params.get("requestPositionId") ?? "");
      this.focusedCandidateApplicationId.set(
        params.get("candidateApplicationId") ?? "",
      );
    });
    void this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.boardS.getBoard();
      this.dataSignal.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  setStatusFilter(filter: BoardStatusFilter): void {
    this.statusFilter.set(this.statusFilter() === filter ? "" : filter);
  }

  setViewMode(mode: InterviewViewMode): void {
    this.viewMode.set(mode);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? "";
    this.searchTerm.set(value);
  }

  openCandidateHistory(candidate: CandidateRecruitmentInterviewBoardItem): void {
    const candidateProcessId =
      candidate.candidateProcessId ?? candidate.candidateApplicationId;

    this.dialogHandlerS.openDialog(
      CandidateInterviewDetailModal,
      { candidateProcessId },
      `Historial - ${candidate.candidateName}`,
      this.dialogHandlerS.sizeLg,
    );
  }

  clearVacancyFocus(): void {
    this.router.navigate(ROUTES.RECLUTAMIENTO.CANDIDATOS_ENTREVISTAS_RECLUTAMIENTO);
  }

  async onAction(
    vacancy: CandidateRecruitmentInterviewBoard,
    candidate: CandidateRecruitmentInterviewBoardItem,
    action: RecruitmentBoardAction,
  ): Promise<void> {
    const result = await this.dialogHandlerS.openDialog<boolean>(
      CandidateRecruitmentScheduleModal,
      {
        item: candidate,
        action,
        customerId: vacancy.customerId,
        requestPositionId: vacancy.requestPositionId,
      },
      this.modalTitle(action, candidate),
      DialogSize.md,
    );
    if (result) {
      await this.onLoadData();
    }
  }

  openAltaForm(
    vacancy: CandidateRecruitmentInterviewBoard,
    candidate: CandidateRecruitmentInterviewBoardItem,
  ): void {
    this.dialogHandlerS
      .openDialog(
        CandidateProcessHiringModal,
        {
          id: candidate.candidateApplicationId,
          candidateProcessId:
            candidate.candidateProcessId ?? candidate.candidateApplicationId,
          candidateId: candidate.candidateId,
          requestPositionId: vacancy.requestPositionId,
          toStage: CandidateProcessStage.AltaEnProceso,
        },
        `Alta de Candidato - ${candidate.candidateName}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((res) => {
        if (res) this.onLoadData();
      });
  }

  private modalTitle(
    action: RecruitmentBoardAction,
    candidate: CandidateRecruitmentInterviewBoardItem,
  ): string {
    switch (action) {
      case "send":
        return `Enviar a entrevista - ${candidate.candidateName}`;
      case "schedule":
        return `Agendar cita - ${candidate.candidateName}`;
      case "reschedule":
        return `Reagendar cita - ${candidate.candidateName}`;
      case "assign":
        return `Cambiar entrevistador - ${candidate.candidateName}`;
      default:
        return "Gestionar entrevista";
    }
  }

  interviewDate(candidate: CandidateRecruitmentInterviewBoardItem): string | null {
    const value = candidate.recruitmentInterviewAt ?? candidate.operationsInterviewAt;
    return value ?? null;
  }

  private matchesSearch(
    candidate: CandidateRecruitmentInterviewBoardItem,
    term: string,
  ): boolean {
    if (!term) return true;
    const haystack = [
      candidate.candidateName,
      candidate.assignedInterviewerName,
      candidate.agendaStatusLabel,
      candidate.currentStage?.toString(),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  }
}

