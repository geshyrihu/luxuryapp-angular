import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IEmployeeBeneficiary } from "../interfaces/employee-beneficiary.interface";

import { ButtonWeb } from "@ui/buttons/web";
@Component({
  selector: "app-employee-beneficiary-list-desktop",
  templateUrl: "./employee-beneficiary-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LuxTableCaption,
    TableEmptyMessage,
    AppTable,
  ],
})
export class EmployeeBeneficiaryListDesktop {
  data = input.required<IEmployeeBeneficiary[]>();
  globalFilterFields = input<string[]>([]);
  isReadOnly = input<boolean>(false);
  loading = input<boolean>(false);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
