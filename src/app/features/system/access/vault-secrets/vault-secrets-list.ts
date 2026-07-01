import { DatePipe } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { WebButtonIcon } from "src/app/core/components/buttons/web/icon/button";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web/icon/button-delete";
import { WebButtonIconEdit } from "src/app/core/components/buttons/web/icon/button-edit";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { VaultSecretForm } from "./vault-secret-form";
import { VaultSecretSummary } from "./vault-secret.model";

@Component({
  selector: "app-vault-secrets-list",
  templateUrl: "./vault-secrets-list.html",
  imports: [
    EmptyState,
    DatePipe,
    TableModule,
    WebButtonIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
  ],
})
export class VaultSecretsList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);
  aspRoleS = inject(AspRoleService);

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    EApplicationRole.SuperUsuario,
  );

  dataSignal = signal<VaultSecretSummary[]>([]);
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
      .onGetList<VaultSecretSummary[]>(Endpoints.VaultSecrets.getAll)
      .then((result) => {
        this.dataSignal.set(result ?? []);
        this.loading.set(false);
      });
  }

  onModalAddForm(): void {
    this.dialogHandlerS
      .openDialog(
        VaultSecretForm,
        {},
        "Nuevo Secreto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalEditForm(item: VaultSecretSummary): void {
    this.dialogHandlerS
      .openDialog(
        VaultSecretForm,
        { secretName: item.secretName, secretType: item.secretType },
        "Editar Secreto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onRotate(secretName: string): void {
    this.apiResponseS
      .onPost(Endpoints.VaultSecrets.rotate(secretName), null)
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }

  onRevoke(secretName: string): void {
    this.apiResponseS
      .onPost(Endpoints.VaultSecrets.revoke(secretName), null)
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }
}
