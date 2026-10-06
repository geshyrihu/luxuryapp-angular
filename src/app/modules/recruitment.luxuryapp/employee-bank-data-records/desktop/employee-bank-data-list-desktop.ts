import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IEmployeeBankData } from "../interfaces/employee-bank-data.interface";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-employee-bank-data-list-desktop",
  templateUrl: "./employee-bank-data-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    WebButtonIcon,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
  ],
})
export class EmployeeBankDataListDesktop {
  data = input.required<IEmployeeBankData[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);
  loading = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
