import { ROUTES } from "src/app/routing/route-paths";
import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CandidateRecruitmentAgendaItem } from "./candidate-application/interfaces/candidate-application";
import { CandidateStageBadge } from "./recruitment-shared/candidate-stage-badge";
import { MappedPTag, MappedTagOption } from "./recruitment-shared/mapped-p-tag";

@Component({
  selector: "app-recruitment-agenda-list",
  standalone: true,
  templateUrl: "./recruitment-agenda-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    WebButtonIconViewPdf,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TableModule,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class RecruitmentAgendaList implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private router = inject(Router);

  dataSignal = signal<CandidateRecruitmentAgendaItem[]>([]);
  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly agendaStatusOptions: MappedTagOption[] = [
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
    { value: "feedback", label: "Con retroalimentación", severity: "success" },
  ];

  readonly statusFilter = signal<string>("");

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return data.length > 0 ? globalFilterFields(data) : [];
  });

  readonly summary = computed(() => {
    const data = this.dataSignal();
    return {
      pendingSchedule: data.filter(
        (x) => x.agendaStatusCode === "pending_schedule",
      ).length,
      scheduled: data.filter((x) => x.agendaStatusCode === "scheduled").length,
      overdue: data.filter((x) => x.agendaStatusCode === "overdue").length,
      missingInterviewer: data.filter(
        (x) => x.agendaStatusCode === "missing_interviewer",
      ).length,
      withFeedback: data.filter((x) => x.agendaStatusCode === "feedback")
        .length,
    };
  });

  readonly filteredData = computed(() => {
    const filter = this.statusFilter();
    if (!filter) return this.dataSignal();
    return this.dataSignal().filter((x) => x.agendaStatusCode === filter);
  });

  trackById = (index: number, item: CandidateRecruitmentAgendaItem) => item.id;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CandidateRecruitmentAgendaItem[]>(
        EndpointsReclutamiento.CandidateProcesses.recruitmentAgenda,
      )
      .then((result) => {
        if (result) {
          this.dataSignal.set(result);
        }
      });
  }

  navigateToApplication(item: CandidateRecruitmentAgendaItem) {
    if (item.workPositionId) {
      this.router.navigate(
        [
          "/recruitment/candidates/work-position",
          item.workPositionId,
          "candidates",
        ],
        {
          queryParams: {
            requestPositionId: item.requestPositionId,
            candidateApplicationId: item.id,
          },
        },
      );
      return;
    }

    this.router.navigate(ROUTES.RECLUTAMIENTO.CANDIDATOS_APLICACIONES, {
      queryParams: { detail: item.id },
    });
  }

  getRowClass(item: CandidateRecruitmentAgendaItem): string {
    if (item.agendaStatusCode === "overdue") return "row-overdue";
    if (item.agendaStatusCode === "missing_interviewer")
      return "row-missing-interviewer";
    if (item.agendaStatusCode === "pending_schedule")
      return "row-pending-schedule";
    return "";
  }
}

