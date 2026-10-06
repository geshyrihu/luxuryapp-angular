import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AppImage } from "@ui/web/image/image";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-equipos-list-desktop",
  templateUrl: "./equipos-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxIcon,
    ButtonWeb,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppImage,
    LxTooltipDirective,
    LuxTableCaption,
    TableFooter,
    LxTag,
  ],
})
export class EquiposListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  categories = input<any[]>([]);
  selectedCategoryId = input<number>(1);
  title = input<string>("");
  active = input<boolean>(true);
  mostrarPreventivos = input<boolean>(true);
  showContents = input<boolean>(false);
  canManage = input<boolean>(false);

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  selectCategory = output<any>();
  add = output<any>();
  openCalendar = output<void>();
  downloadPdf = output<void>();
  downloadQr = output<void>();
  stateChange = output<number>();
  openMaintenances = output<any>();
  documentos = output<any>();
  serviceHistory = output<any>();
  bitacora = output<any>();
  fichaTecnica = output<any>();
  equipmentContents = output<any>();
  edit = output<any>();
  delete = output<any>();
}
