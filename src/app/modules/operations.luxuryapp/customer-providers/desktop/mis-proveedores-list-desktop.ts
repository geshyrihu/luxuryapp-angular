import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-mis-proveedores-desktop",
  templateUrl: "./mis-proveedores-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppAvatar,
    LuxTableCaption,
    ActionMenu,
    WebButtonLabelDelete,
  ],
})
export class MisProveedoresDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: any; title: string }>();
  delete = output<any>();
}
