import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { SanitizeHtmlPipe } from "@shared/pipes/sanitize-html.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ButtonWeb } from "@ui/buttons/web";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-minuta-pendientes-list-desktop",
  templateUrl: "./minuta-pendientes-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LxTag,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxTooltipDirective,
    CustomInputSelectSignal,
    ButtonWeb,
    WebButtonLabel,
    LuxTableCaption,
    TableFooter,
    SanitizeHtmlPipe,
  ],
})
export class MinutaPendientesListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  statusFiltroControl = input.required<FormControl<number>>();

  filter = output<void>();
  downloadPdf = output<void>();
  todosSeguimientos = output<number>();
  agregarSeguimiento = output<{
    meetingDetailsId: any;
    idMeetingSeguimiento: any;
  }>();
  verDetalle = output<{ id: string; title: string }>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
