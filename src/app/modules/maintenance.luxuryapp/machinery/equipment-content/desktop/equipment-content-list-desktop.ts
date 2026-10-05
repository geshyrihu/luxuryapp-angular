import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { AppImage } from "@ui/web/image/image";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { EquipmentContentDto } from "../interfaces/equipment-content.dto";

@Component({
  selector: "app-equipment-content-list-desktop",
  templateUrl: "./equipment-content-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconDelete,
    ButtonWeb,
    AppImage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableFooter,
  ],
})
export class EquipmentContentListDesktop {
  data = input.required<EquipmentContentDto[]>();
  globalFilterFields = input<string[]>([]);
  equipmentName = input<string>("");
  canManage = input<boolean>(false);

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  add = output<void>();
  edit = output<EquipmentContentDto>();
  delete = output<string>();
}
