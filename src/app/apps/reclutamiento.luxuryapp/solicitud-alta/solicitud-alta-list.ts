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
import { Router } from "@angular/router";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { personAddOutline } from "ionicons/icons";
import Swal from "sweetalert2";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";

import { AuthService } from "src/app/core/auth/services/auth.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FilterRequestsService } from "src/app/core/http/services/filter-requests.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { EStatus } from "src/app/shared/ui/base/status-badge.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CandidateProcessHiringModal } from "../candidate-application/candidate-process-hiring-modal";
import { CandidateDetail } from "../candidate/candidate-detail";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../recruitment-shared/request-status-style";
import { SolicitudAltaStatusForm } from "./solicitud-alta-status-form";

interface SolicitudAltaListItem {
  id: string;
  employeeId: string | null;
  applicationUserId?: string | null;
  candidateId?: string;
  candidateProcessId?: string;
  positionRequestId?: string;
  workPositionId?: string | null;
  folio: string;
  folioVacante: string;
  requestDate: string;
  nameCustomer: string;
  nameEmployee: string;
  personActual?: string;
  applicationRole?: string;
  profession?: string;
  status: string;
  isEmployeeLinked: boolean;
  isDocumentationSent: boolean;
  documentationSentAt: string | Date | null;
  executionDate: string;
}

@Component({
  selector: "app-solicitud-alta-list",
  templateUrl: "./solicitud-alta-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabel, MobileButtonLabelConfirm,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    LxTag,
    WebButtonLabel, WebButtonLabelConfirm,
    MobileListItem,
    AppIcon,
  ],
})
export class SolicitudAltaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dateS = inject(DateService);
  private filterRequestsService = inject(FilterRequestsService);
  private router = inject(Router);
  authS = inject(AuthService);
  public statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  tableScrollHeightS = inject(TableScrollHeightService);
  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  dataSignal = signal<SolicitudAltaListItem[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: Table;
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ personAddOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
    effect(() => {
      const term = this.filterRequestsService.searchTerm();
      this.dt?.filterGlobal(term, "contains");
    });
  }

  ngOnInit(): void {
    // Logic moved to effect
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<SolicitudAltaListItem[]>(
        EndpointsReclutamiento.RequestEmployeeRegister.list,
        this.filterRequestsService.getParams(),
      )
      .then((result) => {
        this.dataSignal.set(result);
      });
  }

  async onModalForm(data: SolicitudAltaListItem) {
    this.openHiringModal(data);
  }

  private openHiringModal(data: SolicitudAltaListItem) {
    this.dialogHandlerS
      .openDialog(
        CandidateProcessHiringModal,
        {
          id: data.id,
          candidateProcessId: data.candidateProcessId ?? null,
          candidateId: data.candidateId ?? null,
          requestPositionId: data.positionRequestId ?? null,
          isDraftCompletion: true,
        },
        "Completar Solicitud de Alta",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onConcludeHiring(id: string) {
    this.apiResponseS
      .onPatch<boolean>(
        EndpointsReclutamiento.RequestEmployeeRegister.conclude(id),
        {},
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onAbortHiring(item: SolicitudAltaListItem) {
    this.apiResponseS
      .onPut<boolean>(
        EndpointsReclutamiento.RequestEmployeeRegister.updateStatus(item.id),
        {
          status: EStatus.Cancelado,
          confirmationFinish: false,
        },
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestEmployeeRegister.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onGoToEmployeeFile(item: SolicitudAltaListItem) {
    if (!item.employeeId || !item.applicationUserId) return;

    void this.router.navigate([
      "/recruitment/empleado",
      item.employeeId,
      item.applicationUserId,
    ]);
  }

  async onSendHiringDocs(item: SolicitudAltaListItem) {
    const sendButtonText = item.isDocumentationSent
      ? "Confirmar Reenvío"
      : "Confirmar Envío";
    const result = await Swal.fire({
      title: "Expediente de alta",
      text: "Puedes enviarlo por correo o revisar antes la previsualización del PDF unificado.",
      icon: "question",
      showConfirmButton: true,
      confirmButtonText: sendButtonText,
      confirmButtonColor: "#16a34a",
      showDenyButton: true,
      denyButtonText: "Previsualizar PDF",
      denyButtonColor: "#475569",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const wasSent = await this.apiResponseS.onPost<boolean>(
        EndpointsReclutamiento.RequestEmployeeRegister.sendMergedPdf(item.id),
        {},
      );
      if (wasSent) this.onLoadData();
      return;
    }

    if (result.isDenied) {
      await this.apiResponseS.onPreviewPdf(
        EndpointsReclutamiento.RequestEmployeeRegister.exportMergedPdf(item.id),
      );
    }
  }

  documentationSentTooltip(item: SolicitudAltaListItem): string {
    if (!item.isDocumentationSent) return "Documentación pendiente de envío";

    const sentAt = item.documentationSentAt
      ? this.dateS.formatDateTime(new Date(item.documentationSentAt))
      : "";

    return sentAt
      ? `Documentación enviada el ${sentAt}`
      : "Documentación enviada";
  }

  onViewCandidate(data: SolicitudAltaListItem) {
    if (!data.candidateId) return;

    this.dialogHandlerS.openDialog(
      CandidateDetail,
      { id: data.candidateId },
      "Datos del candidato",
      this.dialogHandlerS.sizeLg,
    );
  }

  onViewRequestDetails(item: SolicitudAltaListItem) {
    this.dialogHandlerS.openDialog(
      SolicitudAltaStatusForm,
      {
        id: item.id,
        employeeName: item.nameEmployee,
        readOnly: true,
      },
      "Detalle de Solicitud de Alta",
      this.dialogHandlerS.sizeMd,
    );
  }

  canCompleteAlta(item: SolicitudAltaListItem): boolean {
    return item.status === "Pendiente";
  }

  canManageLinkedAlta(item: SolicitudAltaListItem): boolean {
    return item.isEmployeeLinked && item.status === "Proceso";
  }

  canOpenCompletedFile(item: SolicitudAltaListItem): boolean {
    return item.status === "Concluido" && !!item.employeeId && !!item.applicationUserId;
  }

  isCancelled(item: SolicitudAltaListItem): boolean {
    return item.status === "Cancelado";
  }
}


