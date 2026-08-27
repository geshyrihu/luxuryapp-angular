import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { addIcons } from "ionicons";
import { personOutline } from "ionicons/icons";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import { SweetAlertIcon } from "src/app/core/enums/sweetalert-icon.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PlatformService } from "src/app/core/services/platform.service";
import Swal from "sweetalert2";
import { CandidateApplicationForm } from "../candidate-application/candidate-application-form";
import { CandidateDetail } from "./candidate-detail";
import { CandidateForm } from "./candidate-form";
import { CandidateInterviewDetailModal } from "./candidate-interview-detail-modal";
import { CandidateListDesktop } from "./desktop/candidate-list-desktop";
import {
  CandidateDeleteImpact,
  CandidateDetail as CandidateDetailDto,
  CandidateListItem,
} from "./interfaces/candidate.dto";
import { CandidateListMobile } from "./mobile/candidate-list-mobile";

@Component({
  selector: "app-candidate-list",
  templateUrl: "./candidate-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [CandidateListDesktop, CandidateListMobile],
})
export class CandidateList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  aspRoleS = inject(AspRoleService);

  dataSignal = signal<CandidateListItem[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    addIcons({ personOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<CandidateListItem[]>(EndpointsReclutamiento.Candidates.list, {
        page: 1,
        recordsNumber: 200,
      })
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onArchive(id: string) {
    this.apiResponseS
      .onPatch(EndpointsReclutamiento.Candidates.archive(id), {})
      .then((response: boolean | false) => {
        if (response) {
          this.dataSignal.update((currentData) =>
            currentData.map((item) =>
              item.id === id
                ? { ...item, status: CandidateStatus.Archived }
                : item,
            ),
          );
        }
      });
  }

  async onDelete(id: string) {
    if (!this.aspRoleS.hasRole(ApplicationRole.SuperUsuario)) return;

    const impact = await this.apiResponseS.onGetItem<CandidateDeleteImpact>(
      EndpointsReclutamiento.Candidates.deleteImpact(id),
    );
    if (!impact) return;

    const result = await Swal.fire({
      title: "Eliminar candidato",
      html: `Se eliminaré permanentemente el candidato y todo lo relacionado en cascada:<br /><br />
        <ul class="text-left" style="display:inline-block">
          <li>Procesos: <b>${impact.candidateProcessesCount}</b></li>
          <li>Entrevistas: <b>${impact.candidateInterviewsCount}</b></li>
          <li>Resultados de entrevistas: <b>${impact.candidateInterviewResultsCount}</b></li>
          <li>Historial de etapas: <b>${impact.candidateStageHistoryCount}</b></li>
          <li>Experiencias laborales: <b>${impact.candidateWorkExperiencesCount}</b></li>
          <li>Roles de postulación: <b>${impact.candidateApplicationRolesCount}</b></li>
        </ul>
        <br /><b>Total de registros afectados: ${impact.totalRelatedRecordsCount}</b><br />
        <span class="text-color-secondary">Esta acción es irreversible.</span>`,
      icon: SweetAlertIcon.Warning,
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });
    if (!result.isConfirmed) return;

    const deleted = await this.apiResponseS.onDelete(
      EndpointsReclutamiento.Candidates.delete(id),
    );
    if (deleted) {
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    }
  }

  async onModalForm(data: { id: string; title: string }) {
    const result = await this.dialogHandlerS.openDialog<
      CandidateDetailDto | boolean
    >(CandidateForm, data, data.title, this.dialogHandlerS.sizeFull);

    if (!result) return;

    this.onLoadData();

    if (typeof result === "boolean" || data.id) return;

    await this.dialogHandlerS.openDialog(
      CandidateApplicationForm,
      {
        id: "",
        title: "Asignar vacante e iniciar entrevista",
        candidateId: result.id,
        allowCreateCandidate: false,
      },
      "Asignar vacante e iniciar entrevista",
      this.dialogHandlerS.sizeLg,
    );

    this.onLoadData();
  }

  onDetail(id: string) {
    this.dialogHandlerS.openDialog(
      CandidateDetail,
      { id },
      "Detalle del candidato",
      this.dialogHandlerS.sizeLg,
    );
  }

  onViewInterview(candidateProcessId: string) {
    this.dialogHandlerS.openDialog(
      CandidateInterviewDetailModal,
      { candidateProcessId },
      "Detalle de entrevista",
      this.dialogHandlerS.sizeLg,
    );
  }
}
