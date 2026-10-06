import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { DatabaseBackupForm } from "./database-backup-form";
import { DatabaseBackupListDesktop } from "./desktop/database-backup-list-desktop";
import { DatabaseBackupConfig } from "./interfaces/database-backup.interface";
import { DatabaseBackupListMobile } from "./mobile/database-backup-list-mobile";

@Component({
  selector: "app-database-backup-list",
  templateUrl: "./database-backup-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatabaseBackupListDesktop, DatabaseBackupListMobile],
})
export class DatabaseBackupList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    ApplicationRole.SuperUsuario,
  );

  dataSignal = signal<DatabaseBackupConfig[]>([]);
  loading = signal(true);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

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

  async onDeleteConfig(id: string): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta configuración de respaldo?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.DatabaseBackup.delete(id))
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }

  onTestConnection(id: string): void {
    this.apiResponseS.onPost(Endpoints.DatabaseBackup.testConnection(id), null);
  }
}
