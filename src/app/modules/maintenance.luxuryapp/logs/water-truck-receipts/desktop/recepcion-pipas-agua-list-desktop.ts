import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { AppImage } from "@ui/web/image/image";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { IRecepcionPipaAgua } from "../recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-list-desktop",
  templateUrl: "./recepcion-pipas-agua-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    CommonModule,
    ApiDatePipe,
    RouterModule,
    AppImage,
    AppIcon,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
  ],
})
export class RecepcionPipasAguaListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<IRecepcionPipaAgua[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
  downloadPdf = output<IRecepcionPipaAgua>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
