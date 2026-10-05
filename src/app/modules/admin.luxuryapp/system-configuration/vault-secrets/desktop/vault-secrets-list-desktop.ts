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
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { VaultSecretSummary } from "../interfaces/vault-secret.model";

@Component({
  selector: "app-vault-secrets-list-desktop",
  templateUrl: "./vault-secrets-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    ButtonWeb,
    WebButtonIconEdit,
    WebButtonIconDelete,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
  ],
})
export class VaultSecretsListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<VaultSecretSummary[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<VaultSecretSummary>();
  rotate = output<string>();
  revoke = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
}
