import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { AsambleaChecklistTemplateDto } from "../interfaces/asamblea-checklist-template.dto";

@Component({
  selector: "app-asamblea-checklist-template-list-desktop",
  templateUrl: "./asamblea-checklist-template-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LuxTableCaption,
    TableFooter],
})
export class AsambleaChecklistTemplateListDesktop {
  private readonly tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<AsambleaChecklistTemplateDto[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();

  readonly tableRows = tableRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  severity(isActive: boolean): "success" | "danger" {
    return isActive ? "success" : "danger";
  }
}
