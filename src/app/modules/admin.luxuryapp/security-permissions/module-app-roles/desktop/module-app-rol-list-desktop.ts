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
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { ModuleAppRolDto } from "../interfaces/module-app-rol.dto";

@Component({
  selector: "app-module-app-rol-list-desktop",
  templateUrl: "./module-app-rol-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppIcon,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTag,
    LuxTableCaption,
    TableFooter,
  ],
})
export class ModuleAppRolListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<ModuleAppRolDto[]>();
  globalFilterFields = input<string[]>([]);

  select = output<{ roleId: any; roleName: string; title: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
