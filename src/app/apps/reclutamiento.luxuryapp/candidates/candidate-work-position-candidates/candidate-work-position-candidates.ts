import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { IWorkPosition } from "src/app/apps/reclutamiento.luxuryapp/estructura-organizacional/work-position/interfaces/work-position.model";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  CandidateRecruitmentInterviewBoard,
  CandidateRecruitmentInterviewBoardItem,
  RecruitmentBoardAction,
} from "../candidate-recruitment-interviews/candidate-recruitment-interviews.interface";
import { CandidateRecruitmentInterviewsService } from "../candidate-recruitment-interviews/candidate-recruitment-interviews.service";
import { CandidateRecruitmentScheduleModal } from "../candidate-recruitment-interviews/candidate-recruitment-schedule-modal";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import {
  MappedPTag,
  MappedTagOption,
} from "../recruitment-shared/mapped-p-tag";

type VacancyView = CandidateRecruitmentInterviewBoard & {
  activeCandidates: CandidateRecruitmentInterviewBoardItem[];
  historicalCandidates: CandidateRecruitmentInterviewBoardItem[];
  isFocused: boolean;
};

@Component({
  selector: "app-candidate-work-position-candidates",
  standalone: true,
  templateUrl: "./candidate-work-position-candidates.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    WebButtonIconViewPdf,
    WebButtonLabel,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class CandidateWorkPositionCandidates implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiResponseS = inject(ApiResponseService);
  private boardS = inject(CandidateRecruitmentInterviewsService);
  private dialogHandlerS = inject(DialogHandlerService);

  readonly loading = signal(false);
  readonly dataSignal = signal<CandidateRecruitmentInterviewBoard[]>([]);
  readonly workPositionDetail = signal<IWorkPosition | null>(null);
  readonly workPositionId = signal("");
  readonly focusedRequestPositionId = signal("");
  readonly focusedCandidateApplicationId = signal("");

  readonly agendaStatusOptions: MappedTagOption[] = [
    { value: "postulada", label: "Postulada", severity: "secondary" },
    {
      value: "pending_schedule",
      label: "Pendiente de agenda",
      severity: "contrast",
    },
    {
      value: "missing_interviewer",
      label: "Sin entrevistador",
      severity: "warn",
    },
    { value: "scheduled", label: "Agendada", severity: "info" },
    { value: "overdue", label: "Vencida", severity: "danger" },
    { value: "feedback", label: "Con feedback", severity: "success" },
    { value: "closed", label: "Historico", severity: "secondary" },
  ];

  readonly positionName = computed(
    () =>
      this.workPositionDetail()?.applicationRoleName ||
      this.filteredVacancies()[0]?.positionName ||
      "Puesto",
  );

  readonly customerName = computed(
    () => this.filteredVacancies()[0]?.customerName || "Cliente",
  );

  readonly totalVacancies = computed(() => this.filteredVacancies().length);
  readonly totalActiveCandidates = computed(() =>
    this.filteredVacancies().reduce(
      (sum, vacancy) => sum + vacancy.activeCandidates.length,
      0,
    ),
  );
  readonly totalHistoricalCandidates = computed(() =>
    this.filteredVacancies().reduce(
      (sum, vacancy) => sum + vacancy.historicalCandidates.length,
      0,
    ),
  );
  readonly totalScheduled = computed(() =>
    this.filteredVacancies().reduce(
      (sum, vacancy) =>
        sum +
        vacancy.activeCandidates.filter((candidate) =>
          ["scheduled", "feedback"].includes(candidate.agendaStatusCode),
        ).length,
      0,
    ),
  );
  readonly totalOverdue = computed(() =>
    this.filteredVacancies().reduce(
      (sum, vacancy) =>
        sum +
        vacancy.activeCandidates.filter(
          (candidate) => candidate.agendaStatusCode === "overdue",
        ).length,
      0,
    ),
  );

  readonly filteredVacancies = computed<VacancyView[]>(() =>
    this.dataSignal()
      .filter((vacancy) => vacancy.workPositionId === this.workPositionId())
      .map((vacancy) => {
        const sortedCandidates = [...vacancy.candidates].sort((a, b) => {
          if (a.candidateApplicationId === this.focusedCandidateApplicationId())
            return -1;
          if (b.candidateApplicationId === this.focusedCandidateApplicationId())
            return 1;
          return 0;
        });

        return {
          ...vacancy,
          activeCandidates: sortedCandidates.filter(
            (candidate) => candidate.agendaStatusCode !== "closed",
          ),
          historicalCandidates: sortedCandidates.filter(
            (candidate) => candidate.agendaStatusCode === "closed",
          ),
          isFocused:
            !!this.focusedRequestPositionId() &&
            vacancy.requestPositionId === this.focusedRequestPositionId(),
        };
      })
      .sort((a, b) => {
        if (a.isFocused) return -1;
        if (b.isFocused) return 1;
        return a.vacancyFolio.localeCompare(b.vacancyFolio);
      }),
  );

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.workPositionId.set(params.get("workPositionId") ?? "");
      void this.onLoadData();
    });

    this.route.queryParamMap.subscribe((params) => {
      this.focusedRequestPositionId.set(params.get("requestPositionId") ?? "");
      this.focusedCandidateApplicationId.set(
        params.get("candidateApplicationId") ?? "",
      );
    });
  }

  async onLoadData(): Promise<void> {
    if (!this.workPositionId()) return;

    this.loading.set(true);
    try {
      const [board, workPosition] = await Promise.all([
        this.boardS.getBoard(),
        this.apiResponseS.onGetItem<IWorkPosition>(
          EndpointsReclutamiento.WorkPositions.getById(this.workPositionId()),
        ),
      ]);

      this.dataSignal.set(board);
      this.workPositionDetail.set(workPosition ?? null);
    } finally {
      this.loading.set(false);
    }
  }

  async onAction(
    vacancy: CandidateRecruitmentInterviewBoard,
    candidate: CandidateRecruitmentInterviewBoardItem,
    action: RecruitmentBoardAction,
  ): Promise<void> {
    const result = await this.dialogHandlerS.openDialog<boolean>(
      CandidateRecruitmentScheduleModal,
      { item: candidate, action, customerId: vacancy.customerId },
      this.modalTitle(action, candidate),
      DialogSize.md,
    );

    if (result) {
      await this.onLoadData();
    }
  }

  navigateToApplicationDetail(candidateApplicationId: string): void {
    this.router.navigate(["/recruitment/candidates/applications"], {
      queryParams: { detail: candidateApplicationId },
    });
  }

  goBackToBoard(): void {
    this.router.navigate(["/recruitment/candidates/recruitment-interviews"]);
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
        return `Asignar entrevistador - ${candidate.candidateName}`;
      default:
        return "Gestionar entrevista";
    }
  }
}
