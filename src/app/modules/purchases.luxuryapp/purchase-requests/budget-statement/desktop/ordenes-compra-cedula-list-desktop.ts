import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-ordenes-compra-cedula-list-desktop",
  templateUrl: "./ordenes-compra-cedula-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppIcon,
  ],
})
export class OrdenesCompraCedulaListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  pagadas = input<number>(0);
  noPagadas = input<number>(0);

  viewOrder = output<any>();
}
