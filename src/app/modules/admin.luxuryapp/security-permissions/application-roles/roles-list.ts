import { NgStyle } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { ApplicationRoleDto } from "./interfaces/application-role.dto";
import { RoleForm } from "./role-form";

@Component({
  selector: "app-roles",
  imports: [
    AppIcon,
    NgStyle,
    TableEmptyMessage,
    FormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    CustomInputCheckSignal,
    LuxTableCaption,
    DataViewMobile,
    MobileActionMenu,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./roles-list.html",
})
export class RolesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<ApplicationRoleDto[]>([]);
  scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = signal([
    "name",
    "displayName",
    "roleType",
    "departament",
  ]);
  loading = signal(true);
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<ApplicationRoleDto[]>(Endpoints.ApplicationRoles.getAll)
      .then((result) => {
        this.dataSignal.set(result || []);
        this.loading.set(false);
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(RoleForm, data, data.title, this.dialogHandlerS.sizeMd)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.ApplicationRoles.delete(id))
      .then((result) => {
        if (result) this.onLoadData();
      });
  }
}
