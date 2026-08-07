import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { ApplicationRoleDto } from "./interfaces/application-role.dto";
import { RoleForm } from "./role-form";

@Component({
  selector: "app-roles",
  imports: [
    AppIcon,
    PrimeNgCustomTableEmptyMessage,
    FormsModule,
    TableModule,
    CustomInputCheckSignal,
    PrimeNgCustomCaption,
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
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
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
