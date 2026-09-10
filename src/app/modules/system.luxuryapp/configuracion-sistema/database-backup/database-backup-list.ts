import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { DatabaseBackupForm } from "./database-backup-form";
import { DatabaseBackupConfig } from "./interfaces/database-backup.interface";

@Component({
  selector: "app-database-backup-list",
  templateUrl: "./database-backup-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonLabel,
    WebButtonIcon,
    AppIcon,
    MobileListItem,
    PrimeNgCustomTableEmptyMessage,
    ApiDatePipe,
    TableModule,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
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
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
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
        this.dialogHandlerS.sizeLg,
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
        this.dialogHandlerS.sizeLg,
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
