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
import { SolicitudAltaStatusForm } from "./solicitud-alta-status-form";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface SolicitudAltaListItem {
  id: string;
  folio: string;
  folioVacante: string;
  requestDate: string;
  nameCustomer: string;
  nameEmployee: string;
  personActual?: string;
  applicationRole?: string;
  profession?: string;
  status: string;
  executionDate: string;
}

@Component({
  selector: "app-solicitud-alta-list",
  templateUrl: "./solicitud-alta-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    LxTag,
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

  onModalForm(data: SolicitudAltaListItem) {
    this.dialogHandlerS
      .openDialog(
        SolicitudAltaStatusForm,
        {
          id: data.id,
          employeeName: data.nameEmployee,
        },
        "Revisar Solicitud",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
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
}
