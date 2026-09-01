import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SelectButtonModule } from "primeng/selectbutton";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { SweetAlertIcon } from "src/app/core/enums/sweetalert-icon.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ROUTES } from "src/app/routing/route-paths";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import Swal from "sweetalert2";
import { CandidateRecruitmentAgendaItem } from "./candidate-application/interfaces/candidate-application";
import { CandidateStageBadge } from "./recruitment-shared/candidate-stage-badge";
import { MappedPTag, MappedTagOption } from "./recruitment-shared/mapped-p-tag";

@Component({
  selector: "app-recruitment-agenda-list",
  templateUrl: "./recruitment-agenda-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    WebButtonIconItem,
    WebButtonIconViewPdf,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    TableModule,
    CandidateStageBadge,
    MappedPTag,
    SelectButtonModule,
    FormsModule,
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
  readonly filterOptions = computed(() => [
    { value: "", label: "Todos" },
    ...this.agendaStatusOptions,
  ]);

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

  canCancelInterview(item: CandidateRecruitmentAgendaItem): boolean {
    return !!item.scheduledInterviewAt;
  }

  async onCancelInterview(item: CandidateRecruitmentAgendaItem): Promise<void> {
    if (!this.canCancelInterview(item)) return;

    const { value: comment } = await Swal.fire({
      title: "Cancelar entrevista",
      text: `Se cancelara la entrevista de ${item.candidateName} para la vacante ${item.vacancyFolio}. Se notificara a las partes involucradas.`,
      icon: SweetAlertIcon.Warning,
      input: "textarea",
      inputPlaceholder: "Motivo de la cancelacion (opcional)",
      inputAttributes: { "aria-label": "Motivo de la cancelacion" },
      showCancelButton: true,
      confirmButtonText: "Si, cancelar",
      cancelButtonText: "Volver",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });

    if (comment === undefined) return;

    const cancelled = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.cancelSchedule(item.id),
      { comment: comment ?? "", cancelInterview: true },
    );

    if (cancelled) this.onLoadData();
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
