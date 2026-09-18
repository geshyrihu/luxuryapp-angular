import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DynamicDialogConfig } from "@core/services/dialog-handler.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { AppTable } from "@ui/web/table/table";
import { AGENDA_STATUS_TAG_OPTIONS } from "../../recruitment-shared/agenda-status-tag-options";
import { CandidateStageBadge } from "../../recruitment-shared/candidate-stage-badge";
import { MappedPTag } from "../../recruitment-shared/mapped-p-tag";
import { CandidateInterviewResponseDto } from "./interfaces/candidate-interview-response.dto";

/**
 * Vista de solo lectura de la entrevista vigente de un candidato, abierta desde el
 * listado maestro de candidatos. No expone acciones de respuesta (aprobar/rechazar);
 * para eso existe la pantalla dedicada `/interviews/respond`.
 */
@Component({
  selector: "app-candidate-interview-detail-modal",
  templateUrl: "./candidate-interview-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    WebButtonIconViewPdf,
    AppTable,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class CandidateInterviewDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);

  readonly candidateProcessId: string =
    this.config.data?.candidateProcessId ?? "";
  readonly interviewData = signal<CandidateInterviewResponseDto | null>(null);
  readonly loading = signal(true);

  readonly agendaStatusOptions = AGENDA_STATUS_TAG_OPTIONS;

  ngOnInit(): void {
    if (!this.candidateProcessId) {
      this.loading.set(false);
      return;
    }

    this.apiResponseS
      .onGetItem<CandidateInterviewResponseDto>(
        EndpointsReclutamiento.CandidateProcesses.interviewResponse(
          this.candidateProcessId,
        ),
      )
      .then((result) => this.interviewData.set(result))
      .finally(() => this.loading.set(false));
  }
}
