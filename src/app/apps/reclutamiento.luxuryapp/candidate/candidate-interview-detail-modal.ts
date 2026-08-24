import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonIconViewPdf } from "@ui/buttons/web-icon/button-view-pdf";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateInterviewResponseDto } from "../candidate-interview/interfaces/candidate-interview-response.dto";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { MappedPTag } from "../recruitment-shared/mapped-p-tag";
import { AGENDA_STATUS_TAG_OPTIONS } from "../recruitment-shared/agenda-status-tag-options";

/**
 * Vista de solo lectura de la entrevista vigente de un candidato, abierta desde el
 * listado maestro de candidatos. No expone acciones de respuesta (aprobar/rechazar);
 * para eso existe la pantalla dedicada `/interviews/respond`.
 */
@Component({
  selector: "app-candidate-interview-detail-modal",
  standalone: true,
  templateUrl: "./candidate-interview-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DatePipe,
    WebButtonLabel,
    WebButtonIconViewPdf,
    TableModule,
    CandidateStageBadge,
    MappedPTag,
  ],
})
export class CandidateInterviewDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  readonly candidateProcessId: string = this.config.data?.candidateProcessId ?? "";
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

  close(): void {
    this.ref.close();
  }
}
