import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { DatabaseBackupForm } from "./database-backup-form";
import { DatabaseBackupConfig } from "./interfaces/database-backup.interface";

@Component({
  selector: "app-database-backup-list",
  templateUrl: "./database-backup-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    AppIcon,
    MobileListItem,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    LuxTableCaption,
    TableFooter,
    DataViewMobile,
    MobileActionMenu,
  ],
})
export class DatabaseBackupList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  aspRoleS = inject(AspRoleService);

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    ApplicationRole.SuperUsuario,
  );

  dataSignal = signal<DatabaseBackupConfig[]>([]);
  loading = signal(true);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiResponseS
      .onGetList<DatabaseBackupConfig[]>(Endpoints.DatabaseBackup.configs)
      .then((result) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onModalAddForm(): void {
    this.dialogHandlerS
      .openDialog(
        DatabaseBackupForm,
        {},
        "Nueva configuracion de respaldo",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditForm(item: DatabaseBackupConfig): void {
    this.dialogHandlerS
      .openDialog(
        DatabaseBackupForm,
        { id: item.id },
        "Editar configuracion de respaldo",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onExecuteBackup(id: string): void {
    this.apiResponseS
      .onPost(Endpoints.DatabaseBackup.execute(id), null)
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }

  onDeleteConfig(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.DatabaseBackup.delete(id))
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }

  onTestConnection(id: string): void {
    this.apiResponseS.onPost(Endpoints.DatabaseBackup.testConnection(id), null);
  }

  statusBadge(status: string): string {
    switch (status) {
      case "Success":
        return "bg-success";
      case "PartialFailure":
        return "bg-warning";
      case "Error":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  destinationLabel(type: string): string {
    return type === "GraphApi" ? "OneDrive" : "Local";
  }
}
