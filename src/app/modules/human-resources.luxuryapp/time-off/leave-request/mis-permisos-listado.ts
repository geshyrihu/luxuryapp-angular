import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ApiDatePipe } from "../../../../shared/pipes/api-date.pipe";

import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LeaveRequestMyDTO } from "@human-resources.luxuryapp/interfaces/leave-request.interface";
import { getStatusSeverity } from "@human-resources.luxuryapp/shared/helpers/status-severity.helper";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { MiPermisoDetalle } from "./mi-permiso-detalle";
import { PermisoForm } from "./permiso-form";

import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";

@Component({
  selector: "app-leave-request-list-my",
  templateUrl: "./mis-permisos-listado.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,

    AppSortableColumn,

    AppSorticon,
    LxTag,
    LuxTableCaption,
    TableFooter,
    DataViewMobile,
  ],
})
export class MisPermisosListado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  getStatusSeverity = getStatusSeverity;
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<LeaveRequestMyDTO[]>([]);
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return Array.isArray(data) && data.length > 0
      ? globalFilterFields(data)
      : [];
  });
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<LeaveRequestMyDTO[]>(Endpoints.HR.LeaveRequest.getAll)
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.LeaveRequest.delete(id))
      .then(() => {
        this.dataSignal.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(PermisoForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalDetail(data: { id: string; title: string }) {
    this.dialogHandlerS.openDialog(
      MiPermisoDetalle,
      data,
      data.title,
      this.dialogHandlerS.sizeXl,
    );
  }
}
