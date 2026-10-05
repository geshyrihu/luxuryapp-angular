import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import {
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { EmployeeFileSummaryDTO } from "../interfaces/employee-file.interfaces";

@Component({
  selector: "app-employee-file-list-desktop",
  templateUrl: "./employee-file-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconItem,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    LuxTableCaption,
    TableFooter,
  ],
})
export class EmployeeFileListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<EmployeeFileSummaryDTO[]>();
  globalFilterFields = input<string[]>([]);

  viewFile = output<EmployeeFileSummaryDTO>();

  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  getStatusBadge(isActive: boolean): string {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-slate-100 text-slate-600 border-slate-200";
  }
}
