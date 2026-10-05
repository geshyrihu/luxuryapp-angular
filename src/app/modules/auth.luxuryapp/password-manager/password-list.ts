import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PagedResultDto } from "@core/interfaces/paged-result.dto";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { CredentialDetailDto } from "./interfaces/credential-detail.dto";
import { PasswordForm } from "./password-form";
import { PasswordListDesktop } from "./desktop/password-list-desktop";
import { PasswordListMobile } from "./mobile/password-list-mobile";

interface PasswordTablePageEvent {
  first: number;
  rows: number;
  globalFilter?: string;
}

@Component({
  selector: "app-password-list",
  templateUrl: "./password-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PasswordListDesktop, PasswordListMobile],
})
export class PasswordList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  data = signal<CredentialDetailDto[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  lastLoadEvent: PasswordTablePageEvent | null = null;

  ngOnInit(): void {}

  async loadData(event: PasswordTablePageEvent) {
    this.lastLoadEvent = event;
    this.loading.set(true);

    const filter = {
      page: event.first! / event.rows! + 1,
      recordsNumber: event.rows,
      filter: event.globalFilter || "",
    };

    const res = await this.apiS.onGetPaged<PagedResultDto<CredentialDetailDto>>(
      Endpoints.PasswordManager.Credentials.getPaged,
      filter,
    );

    if (res?.data) {
      this.data.set(res.data.items ?? []);
      this.totalRecords.set(res.data.totalRecords ?? 0);
    }
    this.loading.set(false);
  }

  async onDelete(id: string) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta credencial?",
    );
    if (!confirmed) return;
    const success = await this.apiS.onDelete(
      Endpoints.PasswordManager.Credentials.delete(id),
    );
    if (success && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }

  async onModalForm(id?: string) {
    const result = await this.dialogS.openDialog<boolean>(
      PasswordForm,
      { id },
      id ? "Editar Credencial" : "Nueva Credencial",
      this.dialogS.sizeMd,
    );

    if (result && this.lastLoadEvent) {
      this.loadData(this.lastLoadEvent);
    }
  }
}
