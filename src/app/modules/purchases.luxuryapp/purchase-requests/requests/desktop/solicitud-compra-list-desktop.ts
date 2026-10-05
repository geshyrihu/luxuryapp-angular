import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { ButtonWeb } from "@ui/buttons/web";
import { TagSeverity } from "@ui/core/tag.base";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppReorderableRow,
  AppReorderableRowHandle,
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { NIVEL_PRIORIDAD_TAG_OPTIONS } from "../nivel-prioridad-tag-options";
import { TIPO_SOLICITUD_TAG_OPTIONS } from "../tipo-solicitud-tag-options";

@Component({
  selector: "app-solicitud-compra-list-desktop",
  templateUrl: "./solicitud-compra-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    AppTable,
    AppReorderableRow,
    AppReorderableRowHandle,
    AppSortableColumn,
    AppSorticon,
    LxTooltipDirective,
    WebButtonLabel,
    WebButtonIcon,
    WebButtonIconDelete,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    AppIcon,
    LxTag,
  ],
})
export class SolicitudCompraListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  statusCompra = input<number>(0);
  isPendingView = input<boolean>(false);
  isAuthorizedView = input<boolean>(false);
  selectedSolicitudIds = input<string[]>([]);

  add = output<void>();
  selectStatus = output<number>();
  presentationMode = output<void>();
  manageLinks = output<void>();
  toggleAllVisible = output<boolean>();
  toggleSelection = output<{ id: string; checked: boolean }>();
  rowReorder = output<{ dragIndex: number; dropIndex: number }>();
  cuadroComparativo = output<string>();
  viewPurchaseOrder = output<string>();
  unlinkPurchaseOrder = output<string>();
  authorizationDetail = output<any>();
  desauthorize = output<any>();
  edit = output<string>();
  delete = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  isInPresentation(id: string): boolean {
    return this.data().some(
      (item) => item.id === id && item.selectedForPresentation,
    );
  }

  areAllVisibleSelected(): boolean {
    return this.data().length > 0
      ? this.data().every((item) =>
          this.data().some(
            (d) => d.id === item.id && d.selectedForPresentation,
          ),
        )
      : false;
  }

  getTipoSolicitudLabel(value: number): string {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getTipoSolicitudSeverity(value: number): TagSeverity {
    return (
      TIPO_SOLICITUD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }

  getPrioridadLabel(value: number): string {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)?.label ??
      "N/D"
    );
  }

  getPrioridadSeverity(value: number): TagSeverity {
    return (
      NIVEL_PRIORIDAD_TAG_OPTIONS.find((item) => item.value === value)
        ?.severity ?? "secondary"
    );
  }
}
