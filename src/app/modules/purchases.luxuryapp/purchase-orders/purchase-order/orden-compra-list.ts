import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { StatusOrdenCompra } from "@core/enums/status-orden-compra.enum";
import { TipoGasto } from "@core/enums/tipo-gasto.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { PdfGenerationService } from "@purchases.luxuryapp/purchase-orders/generator-pdf/pdf-generation.service";
import { PurchaseLinkManager } from "@purchases.luxuryapp/purchase-orders/purchase-link-manager/purchase-link-manager";
import { OrdenCompraService } from "@purchases.luxuryapp/purchase-orders/services/orden-compra.service";
import { ROUTES } from "src/app/routing/route-paths";
import { CreateOrdenCompra } from "./create-orden-compra";
import { OrdenCompraListDesktop } from "./desktop/orden-compra-list-desktop";
import { OrdenCompraListMobile } from "./mobile/orden-compra-list-mobile";
import { OrdenCompra } from "./orden-compra";
import { PurchaseOrderListItem } from "./purchase-order.types";

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

@Component({
  selector: "app-orden-compra-list",
  templateUrl: "./orden-compra-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OrdenCompraListDesktop, OrdenCompraListMobile],
})
export class OrdenCompraList {
  apiResponseS = inject(ApiResponseService);
  aspRoleS = inject(AspRoleService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  customerIdS = inject(CustomerIdService);
  pdfGenerationService = inject(PdfGenerationService);
  platformS = inject(PlatformService);

  data = signal<PurchaseOrderListItem[]>([]);
  loading = signal(true);
  statusCompra = signal<StatusOrdenCompra>(
    this.ordenCompraService.getStatusCompras() as StatusOrdenCompra,
  );
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
      .then((result: PurchaseOrderListItem[] | null) => {
        this.data.set(result ?? []);
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

  onAddOrEdit(id: string) {
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(id));
  }

  onManageLinks() {
    this.dialogHandlerS
      .openDialog(
        PurchaseLinkManager,
        {},
        "Gestión de Vónculos",
        this.dialogHandlerS.sizeXl,
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onSelectTipoGasto(tipo: number) {
    this.tipoGasto.set(tipo);
  }

  onSelectStatus(status: StatusOrdenCompra): void {
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
