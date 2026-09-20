import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CandidateStageBadge } from "../recruitment-shared/candidate-stage-badge";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { CandidateApplicationForm } from "../candidates/candidate-applications/candidate-application-form";
import Swal from "sweetalert2";
import {
  CandidateProcessVacancyDetail,
  CandidateProcessVacancyItem,
} from "../candidates/candidate-recruitment-interviews/candidate-recruitment-interviews.interface";

@Component({
  selector: "app-vacante-candidates-modal",
  templateUrl: "./vacante-candidates-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApiDatePipe, CandidateStageBadge, WebButtonLabel],
})
export class VacanteCandidatesModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly loading = signal(true);
  readonly detail = signal<CandidateProcessVacancyDetail | null>(null);

  private readonly requestPositionId: string =
    this.config.data?.requestPositionId ?? "";

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    if (!this.requestPositionId) return;
    this.loading.set(true);
    try {
      const result =
        await this.apiResponseS.onGetItem<CandidateProcessVacancyDetail>(
          EndpointsReclutamiento.CandidateProcesses.byRequestPosition(
            this.requestPositionId,
          ),
        );
      this.detail.set(result ?? null);
    } finally {
      this.loading.set(false);
    }
  }

  canManage(): boolean {
    const status = this.detail()?.vacancyStatus;
    if (typeof status === "number") return ![1, 2, 4].includes(status);
    const normalized = String(status ?? "").toLowerCase();
    return ![
      "cerrada",
      "cerrado",
      "cancelada",
      "cancelado",
      "concluida",
      "concluido",
    ].includes(normalized);
  }

  async addCandidate(): Promise<void> {
    if (!this.canManage()) return;
    const current = this.detail();
    if (!current) return;

    const result = await this.dialogHandlerS.openDialog<boolean>(
      CandidateApplicationForm,
      {
        requestPositionId: current.requestPositionId,
        requestPositionLabel: current.vacancyFolio,
        lockRequestPosition: true,
        allowCreateCandidate: true,
        excludeCandidateIds: [
          ...current.activeProcesses,
          ...current.historicalProcesses,
        ].map((item) => item.candidateId),
      },
      "Agregar candidato y entrevista",
      this.dialogHandlerS.sizeLg,
    );

    if (result) await this.loadData();
  }

  async editCandidate(item: CandidateProcessVacancyItem): Promise<void> {
    if (!this.canManage()) return;

    const result = await this.dialogHandlerS.openDialog<boolean>(
      CandidateApplicationForm,
      {
        candidateProcessId: item.id,
        lockRequestPosition: true,
      },
      "Editar candidato y entrevista",
      this.dialogHandlerS.sizeLg,
    );

    if (result) await this.loadData();
  }

  async cancelCandidate(item: CandidateProcessVacancyItem): Promise<void> {
    if (!this.canManage()) return;

    const result = await Swal.fire({
      title: "Cancelar proceso",
      text: `Indica por qué se cancela el proceso de ${item.candidateName}.`,
      input: "textarea",
      inputPlaceholder: "Motivo de cancelación",
      showCancelButton: true,
      confirmButtonText: "Cancelar proceso",
      cancelButtonText: "Volver",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    const cancelled = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.CandidateProcesses.cancel(item.id),
      { comment: result.value ?? "" },
    );
    if (cancelled) await this.loadData();
  }

  close(): void {
    this.ref.close(true);
  }

  closureReasonLabel(reason: number | null | undefined): string {
    return (
      {
        0: "Vacante cerrada",
        1: "Rechazo",
        2: "No se presentó",
        3: "Contratación",
        4: "Cancelación manual",
        5: "Otro",
      }[reason ?? -1] ?? "Proceso cerrado"
    );
  }
}
