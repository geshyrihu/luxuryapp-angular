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
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { addIcons } from "ionicons";
import { trendingUpOutline } from "ionicons/icons";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";

import { EndpointsReclutamiento } from "@core/constants/endpoints/reclutamiento.endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { FilterRequestsService } from "@core/http/services/filter-requests.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { StatusSolicitudVacanteService } from "@core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ModificacionSalarioForm } from "./modificacion-salario-form";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import {
  requestStatusBorderColor,
  requestStatusTagSeverity,
} from "../recruitment-shared/request-status-style";

interface SolicitudModificacionListItem {
  id: string;
  folio: string;
  requestDate: string;
  customer: string;
  employee: string;
  applicationRoleCurrent: string;
  currentSalary: number | string;
  applicationRoleNew: string;
  finalSalary: number | string;
  status: string;
}

@Component({
  selector: "app-solicitud-modificacion-list",
  templateUrl: "./solicitud-modificacion-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    TableEmptyMessage,
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
export class SolicitudModificacionList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  filterRequestsService = inject(FilterRequestsService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  tableScrollHeightS = inject(TableScrollHeightService);
  readonly requestStatusBorderColor = requestStatusBorderColor;
  readonly requestStatusTagSeverity = requestStatusTagSeverity;

  dataSignal = signal<SolicitudModificacionListItem[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  @ViewChild("dt") dt?: AppTable;
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ trendingUpOutline });
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
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.list;
    this.apiResponseS
      .onGetList<SolicitudModificacionListItem[]>(
        urlApi,
        this.filterRequestsService.getParams(),
      )
      .then((result) => {
        this.dataSignal.set(result);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(EndpointsReclutamiento.RequestSalaryModification.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onModalForm(data: Pick<SolicitudModificacionListItem, "id">) {
    this.dialogHandlerS
      .openDialog(
        ModificacionSalarioForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
