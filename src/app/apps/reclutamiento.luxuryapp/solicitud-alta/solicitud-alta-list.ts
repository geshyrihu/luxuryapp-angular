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
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabel } from "@ui/buttons/mobile-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { personAddOutline } from "ionicons/icons";
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
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CandidateProcessHiringModal } from "../candidate-application/candidate-process-hiring-modal";
import { CandidateDetail } from "../candidate/candidate-detail";
import {
  DuplicateEmployeeMatch,
  DuplicateEmployeeWarningModal,
} from "./components/duplicate-employee-warning/duplicate-employee-warning-modal";
import { HiringDocumentValidationModal } from "./components/hiring-document-validation/hiring-document-validation-modal";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../recruitment-shared/request-status-style";

interface SolicitudAltaListItem {
  id: string;
  employeeId: string;
  candidateId?: string;
  candidateProcessId?: string;
  positionRequestId?: string;
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
  executionDate: string;
}

@Component({
  selector: "app-solicitud-alta-list",
  templateUrl: "./solicitud-alta-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonIcon,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabel,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    LxTag,
    WebButtonLabel,
    MobileListItem,
    AppIcon,
  ],
})
export class SolicitudAltaList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  private filterRequestsService = inject(FilterRequestsService);
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
    if (data.candidateId && data.candidateProcessId && data.positionRequestId) {
      const matches = await this.apiResponseS.onGetList<DuplicateEmployeeMatch[]>(
        EndpointsReclutamiento.RequestEmployeeRegister.checkEmployeeDuplicates(
          data.candidateId,
        ),
        undefined,
        false,
      );

      if (matches?.length) {
        const decision = await this.dialogHandlerS.openDialog<
          "reactivated" | "continue" | undefined
        >(
          DuplicateEmployeeWarningModal,
          {
            matches,
            requestPositionId: data.positionRequestId,
            candidateProcessId: data.candidateProcessId,
          },
          "Posible Reingreso Detectado",
          this.dialogHandlerS.sizeLg,
        );

        if (decision === "reactivated") {
          this.onLoadData();
          return;
        }

        if (decision !== "continue") return;
      }
    }

    this.openHiringModal(data);
  }

  private openHiringModal(data: SolicitudAltaListItem) {
    this.dialogHandlerS
      .openDialog(
        CandidateProcessHiringModal,
        {
          id: data.id,
          candidateProcessId: null,
          requestPositionId: null,
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
      .onPatch<boolean>(EndpointsReclutamiento.RequestEmployeeRegister.conclude(id), {})
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

  onOpenDocumentValidation(data: SolicitudAltaListItem) {
    this.dialogHandlerS.openDialog(
      HiringDocumentValidationModal,
      { employeeId: data.employeeId },
      "Validación de Documentación",
      this.dialogHandlerS.sizeLg,
    );
  }

  onDownloadPdf(data: SolicitudAltaListItem) {
    this.apiResponseS.onDownloadFile(
      EndpointsReclutamiento.RequestEmployeeRegister.exportPdf(data.id),
      `${data.folio}.pdf`,
    );
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
}
