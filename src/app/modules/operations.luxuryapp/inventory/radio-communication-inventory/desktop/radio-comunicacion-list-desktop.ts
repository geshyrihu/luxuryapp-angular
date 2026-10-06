import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { RadioComunicacion } from "@core/interfaces/radio-comunicacion.interface";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { AppImage } from "@ui/web/image/image";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-radio-comunicacion-list-desktop",
  templateUrl: "./radio-comunicacion-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    LxTooltipDirective,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    AppImage,
    LuxTableCaption,
    TableFooter,
    ApiDatePipe,
  ],
})
export class RadioComunicacionListDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);

  data = input.required<RadioComunicacion[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<RadioComunicacion>();
  delete = output<string>();
  downloadPdf = output<void>();

  scrollHeight = this.tableScrollHeightS.scrollHeight;
}
