import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { briefcaseOutline } from "ionicons/icons";

import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { SweetAlertIcon } from "@core/enums/sweetalert-icon.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import Swal from "sweetalert2";
import { VacanteCandidatesModal } from "./vacante-candidates-modal";
import { VacanteDetailModal } from "./vacante-detail-modal";
import { VacanteForm } from "./vacante-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../recruitment-shared/request-status-style";
import { StatusSolicitudVacanteService } from "./services/status-solicitud-vacante.service";

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

@Component({
  selector: "app-vacantes-list",
  templateUrl: "./vacantes-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    TableEmptyMessage,
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableFooter,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppIcon,
  ],
})
export class VacantesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);
  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  canManageVacancyCandidates(): boolean {
    return (
      this.aspRoleS.hasRole(ApplicationRole.SuperUsuario) ||
      this.aspRoleS.hasRole(ApplicationRole.Reclutamiento)
    );
  }

  dataSignal = signal<VacanteListItem[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: AppTable;
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ briefcaseOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
    effect(() => {
      const term = this.filterRequestsService.searchTerm();
      this.dt?.filterGlobal(term, "contains");
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

  onDelete(id: string) {
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

    const result = await Swal.fire({
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
        this.dialogHandlerS.sizeLg,
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
      this.dialogHandlerS.sizeLg,
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
      this.dialogHandlerS.sizeLg,
    );

    if (result) this.onLoadData();
  }
}
