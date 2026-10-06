import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";

import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppSortableColumn, AppTable } from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-owner-list-desktop",
  templateUrl: "./owner-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxIcon,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    LuxTableCaption,
    TableFooter],
})
export class OwnerListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  canManage = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();
  exportExcel = output<void>();
}
