import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { PdfGenerationService } from "src/app/features/purchases/generator-pdf/pdf-generation.service";
import { PurchaseLinkManager } from "src/app/features/purchases/purchase-link-manager/purchase-link-manager";
import { CreateOrdenCompra } from "./create-orden-compra";
import { OrdenCompra } from "./orden-compra";

const tipoGastoTitles: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "GASTOS FIJOS",
  [ETipoGasto.Variable]: "GASTOS VARIABLES",
  [ETipoGasto.CajaChica]: "CAJA CHICA",
  [ETipoGasto.Extraordinario]: "GASTOS EXTRAORDINARIOS",
  [ETipoGasto.Devoluciones]: "DEVOLUCIONES",
  [ETipoGasto.TarjetaDebito]: "TARJETA DE DÉBITO",
  [ETipoGasto.Proyectos]: "GASTOS DE PROYECTOS",
  [ETipoGasto.Nomina]: "NÓMINA",
  [ETipoGasto.Impuestos]: "IMPUESTOS Y CONTRIBUCIONES",
};

const tipoGastoIcons: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "pi pi-briefcase",
  [ETipoGasto.Variable]: "pi pi-sync",
  [ETipoGasto.CajaChica]: "pi pi-wallet",
  [ETipoGasto.Extraordinario]: "pi pi-bolt",
  [ETipoGasto.Devoluciones]: "pi pi-replay",
  [ETipoGasto.TarjetaDebito]: "pi pi-credit-card",
  [ETipoGasto.Proyectos]: "pi pi-folder-open",
  [ETipoGasto.Nomina]: "pi pi-users",
  [ETipoGasto.Impuestos]: "pi pi-receipt",
};

@Component({
  selector: "app-orden-compra-list",
  templateUrl: "./orden-compra-list.html",
  styles: [`
    :host ::ng-deep .orden-compra-table .p-datatable-table {
      table-layout: fixed;
      width: 100%;
    }

    :host ::ng-deep .orden-compra-table .oc-col-folio {
      width: 7rem;
    }

    :host ::ng-deep .orden-compra-table .oc-col-indice {
      width: 6.5rem;
    }

    :host ::ng-deep .orden-compra-table .oc-col-fondeo {
      width: 12.5rem;
    }

    :host ::ng-deep .orden-compra-table .oc-col-solicitud {
      width: 6.5rem;
    }

    :host ::ng-deep .orden-compra-table .oc-col-descripcion {
      width: 27%;
    }

    :host ::ng-deep .orden-compra-table .oc-col-partida {
      width: 17%;
    }

    :host ::ng-deep .orden-compra-table .oc-col-proveedor {
      width: 11%;
    }

    :host ::ng-deep .orden-compra-table .oc-col-total {
      width: 6rem;
    }

    :host ::ng-deep .orden-compra-table .oc-col-observaciones,
    :host ::ng-deep .orden-compra-table .oc-col-autoriza {
      width: 10%;
    }

    :host ::ng-deep .orden-compra-table .oc-col-actions {
      width: 5rem;
    }

    :host ::ng-deep .orden-compra-table .p-datatable-tbody > tr > td.oc-cell-wrap {
      white-space: normal;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    :host ::ng-deep .orden-compra-table .p-datatable-tbody > tr > td.oc-cell-total,
    :host ::ng-deep .orden-compra-table .p-datatable-thead > tr > th:nth-child(8) {
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
  `],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    TagModule,
    CustomButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
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
  tipoGasto = signal<number>(ETipoGasto.Fijo);

  customTitle = computed(() => {
    return tipoGastoTitles[this.tipoGasto()] ?? "ÓRDENES DE COMPRA";
  });

  tiposDeGasto = Object.keys(ETipoGasto)
    .filter((key) => !isNaN(Number(ETipoGasto[key])))
    .map((key) => {
      const id = ETipoGasto[key] as number;
      return {
        id,
        label: tipoGastoTitles[id] || key.replace(/([A-Z])/g, " $1").trim(),
        iconClass: tipoGastoIcons[id] || "pi pi-tag",
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

    const url = `OrdenCompra/list/${customerId}/${statusCompra}/${tipoGasto}`;

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
    this.apiResponseS.onDelete(`ordencompra/${id}`).then(() => {
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
    this.router.navigateByUrl(`/purchases/orden-compra/${id}`);
  }

  onManageLinks() {
    this.dialogHandlerS
      .openDialog(
        PurchaseLinkManager,
        {},
        "Gestión de Vínculos",
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
