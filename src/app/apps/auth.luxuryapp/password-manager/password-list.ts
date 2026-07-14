import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { ButtonModule } from "primeng/button";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CredentialDetailDto } from "./interfaces/credential-detail.dto";
import { PasswordForm } from "./password-form";

@Component({
  selector: "app-password-list",
  templateUrl: "./password-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileActionMenu,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileListItem,
    DatePipe,
    AppIcon,
    ButtonModule,
    LxTooltipDirective,
  ],
})
export class PasswordList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  data = signal<CredentialDetailDto[]>([]);
  totalRecords = signal(0);
  loading = signal(false);

  rows = tablePrimeNgRows();
  rowsPerPage = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  lastLoadEvent: TableLazyLoadEvent | null = null;

  private visiblePasswords = new Set<string>();

  ngOnInit(): void {}

  async loadData(event: TableLazyLoadEvent) {
    this.lastLoadEvent = event;
    this.loading.set(true);

    const filter = {
      page: event.first! / event.rows! + 1,
      pageSize: event.rows,
      search: event.globalFilter || "",
    };

    const res = await this.apiS.onPostPaged<CredentialDetailDto[]>(
      Endpoints.PasswordManager.Credentials.getPaged,
      filter,
    );

    if (res) {
      this.data.set(res.data);
      this.totalRecords.set(res.totalCount || 0);
    }
    this.loading.set(false);
  }

  async onDelete(id: string) {
    const success = await this.apiS.onDelete(
      Endpoints.PasswordManager.Credentials.delete(id),
    );
    if (success && this.lastLoadEvent) {
      this.visiblePasswords.delete(id);
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

  isPasswordVisible(id: string): boolean {
    return this.visiblePasswords.has(id);
  }

  togglePasswordVisibility(id: string): void {
    if (this.visiblePasswords.has(id)) {
      this.visiblePasswords.delete(id);
    } else {
      this.visiblePasswords.add(id);
    }
  }

  getPasswordDisplay(id: string, password: string): string {
    return this.isPasswordVisible(id) ? password : "••••••••";
  }

  async copyPassword(password: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(password);
    } catch {
      // Fallback: crear textarea temporal
      const textarea = document.createElement("textarea");
      textarea.value = password;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  }
}
