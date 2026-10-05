import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { rowsPerPageOptions, tableRows } from "@core/helpers/table-options";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { TableFooter } from "src/app/shared/ui/web/lux-table-footer/lux-table-footer";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";

@Component({
  selector: "app-orden-compra-list-desktop",
  templateUrl: "./orden-compra-list-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host ::ng-deep .orden-compra-table .lux-table-table {
        table-layout: fixed;
        width: 100%;
      }

      :host ::ng-deep .orden-compra-table .oc-col-identificadores {
        width: 9rem;
      }

      :host ::ng-deep .orden-compra-table .oc-col-seguimiento {
        width: 11rem;
      }

      :host ::ng-deep .orden-compra-table .oc-col-descripcion {
        width: 28%;
      }

      :host ::ng-deep .orden-compra-table .oc-col-partida {
        width: 18%;
      }

      :host ::ng-deep .orden-compra-table .oc-col-proveedor {
        width: 14%;
      }

      :host ::ng-deep .orden-compra-table .oc-col-total {
        width: 7rem;
      }

      :host ::ng-deep .orden-compra-table .oc-col-observaciones,
      :host ::ng-deep .orden-compra-table .oc-col-autoriza {
        width: 10%;
      }

      :host ::ng-deep .orden-compra-table .oc-col-actions {
        width: 4rem;
      }

      :host
        ::ng-deep
        .orden-compra-table
        .lux-table-tbody
        > tr
        > td.oc-cell-wrap {
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      :host
        ::ng-deep
        .orden-compra-table
        .lux-table-tbody
        > tr
        > td.oc-cell-total,
      :host
        ::ng-deep
        .orden-compra-table
        .lux-table-thead
        > tr
        > th:nth-child(6) {
        text-align: right;
      }

      :host ::ng-deep .orden-compra-table .oc-cell-actions {
        white-space: normal;
      }

      :host ::ng-deep .orden-compra-table .oc-actions-container {
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.25rem;
      }

      :host ::ng-deep .orden-compra-table .oc-cell-wrap ul {
        margin: 0;
        padding-left: 1rem;
      }
    `,
  ],
  imports: [
    CommonModule,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    WebButtonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    LuxTableCaption,
    TableEmptyMessage,
    TableFooter,
    ActionMenu,
    LxTag,
    AppIcon,
  ],
})
export class OrdenCompraListDesktop {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  customTitle = input<string>("");
  tiposDeGasto = input<any[]>([]);
  tipoGasto = input<number>(0);
  statusCompra = input<number>(0);

  add = output<void>();
  selectTipoGasto = output<number>();
  selectStatus = output<number>();
  manageLinks = output<void>();
  ordenCompraModal = output<string>();
  addOrEdit = output<string>();
  delete = output<string>();
  downloadSolicitudPagoPdf = output<string>();
  downloadOrdenCompraPdf = output<string>();

  readonly tableRows: number = tableRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
}
