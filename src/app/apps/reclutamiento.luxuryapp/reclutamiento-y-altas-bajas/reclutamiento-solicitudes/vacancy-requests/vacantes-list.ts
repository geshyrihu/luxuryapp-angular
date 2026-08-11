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
import { Router, RouterModule } from "@angular/router";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Table, TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { briefcaseOutline } from "ionicons/icons";
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
import { VacanteDetailModal } from "./vacante-detail-modal";
import { VacanteForm } from "./vacante-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

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
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    LxTag,
    MobileListItem,
    AppIcon,
    RouterModule,
    WebButtonLabel,
  ],
})
export class VacantesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  router = inject(Router);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<VacanteListItem[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: Table;
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

  goToVacancyCandidates(workPositionId: string, requestPositionId: string) {
    this.router.navigate([
      "/recruitment/candidates/work-position",
      workPositionId,
      "candidates",
    ], {
      queryParams: { requestPositionId },
    });
  }

  goToCandidates() {
    this.router.navigate(["/recruitment/candidates/candidates"]);
  }

  goToAgenda() {
    this.router.navigate(["/recruitment/candidates/recruitment-agenda"]);
  }
}
