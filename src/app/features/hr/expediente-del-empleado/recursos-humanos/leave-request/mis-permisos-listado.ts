import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { getStatusSeverity } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/helpers/status-severity.helper";
import { LeaveRequestMyDTO } from "src/app/features/hr/expediente-del-empleado/recursos-humanos/interfaces/leave-request.interface";
import { MiPermisoDetalle } from "./mi-permiso-detalle";
import { PermisoForm } from "./permiso-form";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LxTag } from "@ui/adaptive/tag/tag";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-leave-request-list-my",
  templateUrl: "./mis-permisos-listado.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    LxTag,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
  ],
})
export class MisPermisosListado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  getStatusSeverity = getStatusSeverity;
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<LeaveRequestMyDTO[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
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
      .openDialog(PermisoForm, data, data.title, this.dialogHandlerS.sizeLg)
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
      this.dialogHandlerS.sizeLg,
    );
  }
}
