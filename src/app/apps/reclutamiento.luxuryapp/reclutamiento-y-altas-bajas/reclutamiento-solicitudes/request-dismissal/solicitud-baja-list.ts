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
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import { personRemoveOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { Table, TableModule } from "primeng/table";

import { AuthService } from "src/app/core/auth/services/auth.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { FilterRequestsService } from "src/app/core/http/services/filter-requests.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SolicitudBajaUpdateStatus } from './solicitud-baja-update-status';

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-solicitud-baja-list",
  templateUrl: "./solicitud-baja-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
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
  ],
})
export class SolicitudBajaList implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  filterRequestsService = inject(FilterRequestsService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<any[]>([]);

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
    addIcons({ personRemoveOutline });
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
    const urlApi = `requestdismissal/list/`;
    const params = this.filterRequestsService.getParams();
    this.apiResponseS.onGetList(urlApi, params).then((result: any) => {
      this.dataSignal.set(result);
    });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        SolicitudBajaUpdateStatus,
        {
          id: data.id,
          status: data.status,
        },
        data.title,
        this.dialogHandlerS.sizeSm,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RequestDismissal/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }
}
