import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { SweetAlertIcon } from "@core/enums/sweetalert-icon.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { addIcons } from "ionicons";
import { briefcaseOutline } from "ionicons/icons";
import { VacantesListDesktop } from "./desktop/vacantes-list-desktop";
import { VacantesListMobile } from "./mobile/vacantes-list-mobile";
import { StatusSolicitudVacanteService } from "./services/status-solicitud-vacante.service";
import { VacanteCandidatesModal } from "./vacante-candidates-modal";
import { VacanteDetailModal } from "./vacante-detail-modal";
import { VacanteForm } from "./vacante-form";
import { VacanteJobDescriptionModal } from "./vacante-job-description-modal";

interface VacanteListItem {
  id: string;
  folio: string;
  requestDate: string;
  customer: string;
  applicationRoleName: string;
  sueldoMensualLibre: number;
  daysPassed: number;
  status: string;
  nameCandidate?: string;
  workPositionId: string;
}

interface RequestPositionDeleteImpact {
  requestPositionId: string;
  candidateProcessesCount: number;
  candidateInterviewsCount: number;
  candidateInterviewResultsCount: number;
  candidateStageHistoryCount: number;
  requestEmployeeRegistersCount: number;
  requestSalaryModificationsCount: number;
  totalRelatedRecordsCount: number;
  relatedEntities: string[];
}

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-vacantes-list",
  templateUrl: "./vacantes-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VacantesListDesktop, VacantesListMobile],
})
export class VacantesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);

  canManageVacancyCandidates(): boolean {
    return (
      this.aspRoleS.hasRole(ApplicationRole.SuperUsuario) ||
      this.aspRoleS.hasRole(ApplicationRole.Reclutamiento)
    );
  }

  dataSignal = signal<VacanteListItem[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ briefcaseOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    this.apiResponseS
      .onGetList<VacanteListItem[]>(
        EndpointsReclutamiento.RequestPosition.list,
        this.filterRequestsService.getParams(),
      )
      .then((result) => this.dataSignal.set(result));
  }

  async onDelete(id: string) {

    const confirmed = await this.confirmS.confirm(

      "¿Está seguro de eliminar esta vacante?",

    );

    if (!confirmed) return;
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestPosition.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  async onDeletePermanente(id: string) {
    if (!this.aspRoleS.hasRole(ApplicationRole.SuperUsuario)) return;

    const impact =
      await this.apiResponseS.onGetItem<RequestPositionDeleteImpact>(
        EndpointsReclutamiento.RequestPosition.deleteImpact(id),
      );
    if (!impact) return;

    const result = await SwalService.show({
      title: "Eliminar vacante",
      html: `Se eliminaré permanentemente la vacante y todo lo relacionado en cascada:<br /><br />
        <ul class="text-left" style="display:inline-block">
          <li>Procesos candidato-vacante: <b>${impact.candidateProcessesCount}</b></li>
          <li>Entrevistas: <b>${impact.candidateInterviewsCount}</b></li>
          <li>Resultados de entrevista: <b>${impact.candidateInterviewResultsCount}</b></li>
          <li>Historial de etapas: <b>${impact.candidateStageHistoryCount}</b></li>
          <li>Registros de alta de empleado: <b>${impact.requestEmployeeRegistersCount}</b></li>
          <li>Modificaciones salariales: <b>${impact.requestSalaryModificationsCount}</b></li>
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
      EndpointsReclutamiento.RequestPosition.deleteCascade(id),
    );
    if (deleted) {
      this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    }
  }

  onModalForm(data: Pick<VacanteListItem, "id">) {
    this.dialogHandlerS
      .openDialog(
        VacanteForm,
        { id: data.id },
        "Editar vacante",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalDetail(workPositionId: string) {
    this.dialogHandlerS.openDialog(
      VacanteDetailModal,
      { workPositionId },
      "Detalle del puesto",
      this.dialogHandlerS.sizeFull,
    );
  }

  onModalJobDescription(workPositionId: string) {
    this.dialogHandlerS.openDialog(
      VacanteJobDescriptionModal,
      { workPositionId },
      "Descripción del puesto",
      this.dialogHandlerS.sizeXl,
    );
  }

  async goToVacancyCandidates(
    workPositionId: string,
    requestPositionId: string,
  ) {
    if (
      !this.aspRoleS.hasRole(ApplicationRole.SuperUsuario) &&
      !this.aspRoleS.hasRole(ApplicationRole.Reclutamiento)
    ) {
      return;
    }

    const item = this.dataSignal().find(
      (vacancy) => vacancy.id === requestPositionId,
    );
    const result = await this.dialogHandlerS.openDialog<boolean>(
      VacanteCandidatesModal,
      {
        workPositionId,
        requestPositionId,
        vacancyStatus: item?.status,
      },
      "Candidatos de la vacante",
      this.dialogHandlerS.sizeXl,
    );

    if (result) this.onLoadData();
  }
}
