import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxAvatar } from "@ui/adaptive/avatar/avatar";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { firstValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateInterviewFeedbackForm } from "src/app/shared/integration/reclutamiento/candidates/candidate-interview/candidate-interview-feedback-form";
import { CANDIDATE_STATUS_TAG_OPTIONS } from "src/app/shared/integration/reclutamiento/candidates/candidate/candidate-status-tag-options";
import {
  CandidateDetail,
  CandidateWorkExperienceItem,
} from "src/app/shared/integration/reclutamiento/candidates/candidate/interfaces/candidate.dto";
import { MappedPTag } from "src/app/shared/integration/reclutamiento/candidates/recruitment-shared/mapped-p-tag";

/**
 * Detalle completo de un candidato de la cola de entrevistador (info personal,
 * CV, experiencia laboral) con acceso directo a responder la entrevista.
 * No expone edicion: para eso existe `CandidateForm` en el modulo Candidates.
 */
@Component({
  selector: "app-employee-queue-candidate-detail-modal",
  templateUrl: "./employee-queue-candidate-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,

    LxAvatar,
    MappedPTag,
    WebButtonLabel,
    WebButtonLabelViewPdf,
  ],
})
export class EmployeeQueueCandidateDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private enumSelectS = inject(EnumSelectService);
  private dialogHandlerS = inject(DialogHandlerService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  private readonly candidateApplicationId: string =
    this.config.data?.candidateApplicationId ?? "";
  private readonly candidateProcessId: string | undefined =
    this.config.data?.candidateProcessId ?? undefined;

  /** true solo si el proceso tiene una entrevista Programada activa sobre la cual decidir. */
  readonly canRespond: boolean = this.config.data?.canRespond ?? false;
  readonly pendingAction: string = this.config.data?.pendingAction ?? "";

  readonly detail = signal<CandidateDetail | null>(null);
  readonly loading = signal(true);
  readonly workExperiences = signal<CandidateWorkExperienceItem[]>([]);
  readonly recruitmentSourceOptions = signal<SelectItemDto[]>([]);

  readonly statusOptions = CANDIDATE_STATUS_TAG_OPTIONS;

  readonly initials = computed(() => {
    const name = this.detail()?.fullName ?? "";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  });

  readonly recruitmentSourceLabel = computed(() => {
    const source = this.detail()?.recruitmentSource;
    if (source === null || source === undefined) return "Sin registrar";
    return (
      this.recruitmentSourceOptions().find((opt) => opt.value === source)
        ?.label ?? "Sin registrar"
    );
  });

  async ngOnInit(): Promise<void> {
    const candidateId: string = this.config.data?.candidateId ?? "";
    void this.loadRecruitmentSourceOptions();

    if (!candidateId) {
      this.loading.set(false);
      return;
    }

    this.apiResponseS
      .onGetItem<CandidateDetail>(
        EndpointsReclutamiento.Candidates.getById(candidateId),
      )
      .then((result) => {
        this.detail.set(result);
        this.workExperiences.set(result?.workExperiences ?? []);
      })
      .finally(() => this.loading.set(false));
  }

  private async loadRecruitmentSourceOptions(): Promise<void> {
    this.recruitmentSourceOptions.set(
      await firstValueFrom(this.enumSelectS.fuenteReclutamiento()),
    );
  }

  respondToInterview(): void {
    if (!this.canRespond) return;

    this.dialogHandlerS
      .openDialog<boolean>(
        CandidateInterviewFeedbackForm,
        {
          candidateApplicationId: this.candidateApplicationId,
          candidateProcessId: this.candidateProcessId,
        },
        `Responder entrevista — ${this.detail()?.fullName ?? ""}`,
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.ref.close(true);
      });
  }

  close(): void {
    this.ref.close();
  }
}
