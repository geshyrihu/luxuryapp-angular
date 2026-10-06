import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";

import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-propiedades-list-desktop",
  templateUrl: "./propiedades-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    CommonModule,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter],
})
export class PropiedadesListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  canManage = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();
  showOccupants = output<any>();
  downloadTemplate = output<void>();
  fileSelected = output<any>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  formatAccountNumber(accountNumber: string): string {
    const digits = (accountNumber || "").replace(/\D/g, "");
    if (!digits) return "";

    return digits.match(/.{1,3}/g)?.join("-") ?? digits;
  }
}
