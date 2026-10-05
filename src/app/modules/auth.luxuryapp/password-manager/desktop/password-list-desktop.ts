import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { CredentialDetailDto } from "../interfaces/credential-detail.dto";

interface PasswordTablePageEvent {
  first: number;
  rows: number;
  globalFilter?: string;
}

@Component({
  selector: "app-password-list-desktop",
  templateUrl: "./password-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    WebButtonIconDelete,
    ApiDatePipe,
    AppIcon,
    ButtonWeb,
    LxTooltipDirective,
  ],
})
export class PasswordListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<CredentialDetailDto[]>();
  totalRecords = input<number>(0);
  loading = input<boolean>(false);

  load = output<PasswordTablePageEvent>();
  add = output<void>();
  edit = output<string>();
  delete = output<string>();

  rows = tableRows();
  rowsPerPage = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  private visiblePasswords = new Set<string>();

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
