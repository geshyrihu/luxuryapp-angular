import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { ApiDatePipe } from "src/app/shared/pipes/api-date.pipe";

import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { PdfGenerationService } from "src/app/apps/supplier.luxuryapp/po/generator-pdf/pdf-generation.service";
import { PurchaseLinkManager } from "src/app/apps/supplier.luxuryapp/po/purchase-link-manager/purchase-link-manager";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { TipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { CreateOrdenCompra } from "./create-orden-compra";
import { OrdenCompra } from "./orden-compra";

const tipoGastoTitles: { [key: number]: string } = {
  [TipoGasto.Fijo]: "GASTOS FIJOS",
  [TipoGasto.Variable]: "GASTOS VARIABLES",
  [TipoGasto.CajaChica]: "CAJA CHICA",
  [TipoGasto.Extraordinario]: "GASTOS EXTRAORDINARIOS",
  [TipoGasto.Devoluciones]: "DEVOLUCIONES",
  [TipoGasto.TarjetaDebito]: "TARJETA DE DóBITO",
  [TipoGasto.Proyectos]: "GASTOS DE PROYECTOS",
  [TipoGasto.Nomina]: "NóMINA",
  [TipoGasto.Impuestos]: "IMPUESTOS Y CONTRIBUCIONES",
};

const tipoGastoIcons: { [key: number]: string } = {
  [TipoGasto.Fijo]: "material-symbols-light:work",
  [TipoGasto.Variable]: "material-symbols-light:sync",
  [TipoGasto.CajaChica]: "material-symbols-light:wallet",
  [TipoGasto.Extraordinario]: "material-symbols-light:bolt",
  [TipoGasto.Devoluciones]: "material-symbols-light:replay",
  [TipoGasto.TarjetaDebito]: "material-symbols-light:credit-card",
  [TipoGasto.Proyectos]: "material-symbols-light:folder-open",
  [TipoGasto.Nomina]: "material-symbols-light:group",
  [TipoGasto.Impuestos]: "material-symbols-light:receipt",
};

import { LxTag } from "@ui/adaptive/tag/tag";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-orden-compra-list",
  templateUrl: "./orden-compra-list.html",
  styles: [
    `
      :host ::ng-deep .orden-compra-table .p-datatable-table {
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
        .p-datatable-tbody
        > tr
        > td.oc-cell-wrap {
        white-space: normal;
        overflow-wrap: anywhere;
        word-break: break-word;
      }

      :host
        ::ng-deep
        .orden-compra-table
        .p-datatable-tbody
        > tr
        > td.oc-cell-total,
      :host
        ::ng-deep
        .orden-compra-table
        .p-datatable-thead
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ApiDatePipe,
    RouterModule,
    TableModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    WebButtonLabelItem,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    LxTag,
    MobileListItem,
    AppIcon,
  ],
})
export class OrdenCompraList {
  apiResponseS = inject(ApiResponseService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  customerIdS = inject(CustomerIdService);
  pdfGenerationService = inject(PdfGenerationService);

  data = signal<any[]>([]);
  loading = signal(true);
  statusCompra = signal<number>(this.ordenCompraService.getStatusCompras());
  tipoGasto = signal<number>(TipoGasto.Fijo);

  customTitle = computed(() => {
    return tipoGastoTitles[this.tipoGasto()] ?? "óRDENES DE COMPRA";
  });

  tiposDeGasto = Object.keys(TipoGasto)
    .filter((key) => !isNaN(Number(TipoGasto[key])))
    .map((key) => {
      const id = TipoGasto[key] as number;
      return {
        id,
        label: tipoGastoTitles[id] || key.replace(/([A-Z])/g, " $1").trim(),
        iconClass: tipoGastoIcons[id] || "material-symbols-light:label",
      };
    });

  globalFilterFields = computed(() => globalFilterFields(this.data()));
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData();
      }
    });
  }

  onLoadData() {
    this.loading.set(true);
    const customerId: string = this.customerIdS.customerId();
    const statusCompra = this.statusCompra();
    const tipoGasto = this.tipoGasto();

    const url = Endpoints.PurchaseOrders.list(
      customerId,
      statusCompra,
      tipoGasto,
    );

    this.apiResponseS
      .onGetList(url)
      .then((result: any) => {
        this.data.set(result);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS.onDelete(Endpoints.PurchaseOrders.delete(id)).then(() => {
      this.data.update((data) => data.filter((item) => item.id !== id));
    });
  }

  onOrdenCompraModal(id: string) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS
      .openDialog(OrdenCompra, { id }, "", this.dialogHandlerS.sizeFull, true)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onModalAdd() {
    const tipoGastoValue = this.tipoGasto();
    if (isNaN(tipoGastoValue)) {
      console.error("Invalid expense type");
      return;
    }
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompra,
        { tipoGasto: tipoGastoValue },
        "Nueva Orden de compra",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onAddOrEdit(id: any) {
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(id));
  }

  onManageLinks() {
    this.dialogHandlerS
      .openDialog(
        PurchaseLinkManager,
        {},
        "Gestión de Vónculos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onSelectTipoGasto(tipo: number) {
    this.tipoGasto.set(tipo);
  }

  onSelectStatus(status: number): void {
    this.statusCompra.set(status);
    this.ordenCompraService.setStatusCompras(status);
  }

  onDownloadOrdenCompraPdf(ordenCompraId: string): void {
    this.pdfGenerationService.generateOrdenCompraPdf(ordenCompraId);
  }

  onDownloadSolicitudPagoPdf(ordenCompraId: string): void {
    this.pdfGenerationService.generateSolicitudPagoPdf(ordenCompraId);
  }
}
