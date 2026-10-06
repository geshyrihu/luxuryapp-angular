import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonWeb } from "@ui/buttons/web";
import { AppAvatar } from "@ui/web/avatar/avatar";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-employee-external-list-desktop",
  templateUrl: "./employee-external-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
    AppAvatar,
  ],
})
export class EmployeeExternalListDesktop {
  data = input.required<any[]>();

  add = output<{ userId: string; title: string }>();
  edit = output<{ userId: string; title: string }>();
  userApp = output<string>();
  removeFromCustomer = output<string>();
  cardEmployee = output<string>();
}
