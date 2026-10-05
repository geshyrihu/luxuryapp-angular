import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { RangoCalendarioyyyymmdd } from "@ui/web/rango-calendario-yyyymmdd/rango-calendario-yyyymmdd";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-bitacora-mantenimiento-desktop",
  templateUrl: "./bitacora-mantenimiento-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RangoCalendarioyyyymmdd,
    WebButtonIconConfirm,
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LuxTableCaption,
  ],
})
export class BitacoraMantenimientoDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  isJefeMantenimiento = input<boolean>(false);

  add = output<any>();
  delete = output<any>();
  cardEmployee = output<string>();
}
