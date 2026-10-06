import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ButtonWeb } from "@ui/buttons/web";
import { PdfViewerTrigger } from "@ui/web/pdf-viewer-trigger/pdf-viewer-trigger";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-documento-personalizado-lista-desktop",
  templateUrl: "./documento-personalizado-lista-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PdfViewerTrigger,
    ButtonWeb,
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    ReactiveFormsModule,
    LuxTableCaption,
    TableFooter],
})
export class DocumentoPersonalizadoListaDesktop {
  tableScrollHeightS = inject(TableScrollHeightService);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);

  add = output<{ id: string; title: string }>();
  edit = output<{ id: string; title: string }>();
  delete = output<string>();
}
