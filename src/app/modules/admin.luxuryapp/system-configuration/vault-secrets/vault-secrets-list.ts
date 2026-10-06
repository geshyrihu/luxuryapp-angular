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
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { VaultSecretsListDesktop } from "./desktop/vault-secrets-list-desktop";
import { VaultSecretSummary } from "./interfaces/vault-secret.model";
import { VaultSecretsListMobile } from "./mobile/vault-secrets-list-mobile";
import { VaultSecretForm } from "./vault-secret-form";

@Component({
  selector: "app-vault-secrets-list",
  templateUrl: "./vault-secrets-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VaultSecretsListDesktop, VaultSecretsListMobile],
})
export class VaultSecretsList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    ApplicationRole.SuperUsuario,
  );

  dataSignal = signal<VaultSecretSummary[]>([]);
  loading = signal(true);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

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
        this.dialogHandlerS.sizeXl,
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
        this.dialogHandlerS.sizeXl,
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

  async onRevoke(secretName: string): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de revocar este secreto?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onPost(Endpoints.VaultSecrets.revoke(secretName), null)
      .then((result) => {
        if (result !== false) this.onLoadData();
      });
  }
}
