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
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { DatabaseBackupConfig } from "../interfaces/database-backup.interface";

@Component({
  selector: "app-database-backup-list-desktop",
  templateUrl: "./database-backup-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
  ],
})
export class DatabaseBackupListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<DatabaseBackupConfig[]>();
  loading = input<boolean>(false);
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<DatabaseBackupConfig>();
  execute = output<string>();
  delete = output<string>();
  testConnection = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

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
