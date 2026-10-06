import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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
import { LevelThreeAccountListDesktop } from "./desktop/level-three-account-list-desktop";
import { LevelThreeAccountForm } from "./level-three-account-form";
import { LevelThreeAccountListMobile } from "./mobile/level-three-account-list-mobile";

@Component({
  selector: "app-level-three-account-list",
  templateUrl: "./level-three-account-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LevelThreeAccountListDesktop, LevelThreeAccountListMobile],
})
export class LevelThreeAccountList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  aspRoleS = inject(AspRoleService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  dataSignal = signal<any[]>([]);
  readonly globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  readonly isSuperUsuario = this.aspRoleS.roleSignal(
    ApplicationRole.SuperUsuario,
  );

  state: boolean = true;

  ngOnInit(): void {
    this.onLoadData(this.state);
  }

  onLoadData(state: boolean) {
    this.state = state;
    this.apiResponseS
      .onGetList(Endpoints.AccountingAccounts.getList(state))
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.AccountingAccounts.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(LevelThreeAccountForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData(this.state);
      });
  }
}
