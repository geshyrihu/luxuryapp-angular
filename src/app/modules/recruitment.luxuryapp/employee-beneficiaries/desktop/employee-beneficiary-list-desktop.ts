import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { IEmployeeBeneficiary } from "../interfaces/employee-beneficiary.interface";

@Component({
  selector: "app-employee-beneficiary-list-desktop",
  templateUrl: "./employee-beneficiary-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIcon,
    WebButtonIconConfirm,
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
