import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-owner-list-desktop",
  templateUrl: "./owner-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    LuxTableCaption,
    TableFooter,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
  ],
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
