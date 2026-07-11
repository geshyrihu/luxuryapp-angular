import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { addIcons } from "ionicons";
import { cartOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { Subscription } from "rxjs";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { SolicitudCompraService } from "src/app/core/services/solicitud-compra.service";
import { OrdenCompra } from "src/app/apps/supplier.luxuryapp/po/purchase-order/orden-compra";
import { ROUTES } from "src/app/routing/route-paths";
import Swal from "sweetalert2";
import { PurchaseLinkManager } from "../../po/purchase-link-manager/purchase-link-manager";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-solicitud-compra-list",
  templateUrl: "./solicitud-compra-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    TagModule,
    LxTooltipDirective,
    WebButtonLabel,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    AppIcon,
    MobileListItem,
  ],
})
export class SolicitudCompraList {
  apiResponseS = inject(ApiResponseService);
  aspRoleS = inject(AspRoleService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  data = signal<any[]>([]);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  solicitudCompraService = inject(SolicitudCompraService);
  ordenCompraService = inject(OrdenCompraService);

  public AspRole = ApplicationRole;

  globalFilterFields: string[] = [
    "folio",
    "solicita",
    "equipoOInstalacion",
    "justificacionGasto",
    "ordenesRelacionadas.folio",
  ];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  subRef$: Subscription;
  statusCompra = signal<number>(
    this.solicitudCompraService.onGetStatusFiltro(),
  );
  selectedSolicitudIds = signal<string[]>([]);

  constructor() {
    addIcons({ cartOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.PurchaseRequests.listSolicitudCompraByCustomerAndStatus(
          this.customerIdS.customerId(),
          this.solicitudCompraService.onGetStatusFiltro(),
        ),
      )
      .then((result: any) => {
        const normalized = Array.from(result || []);
        this.data.set(normalized);
        this.selectedSolicitudIds.set(
          normalized
            .filter((item: any) => item.selectedForPresentation)
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((item: any) => item.id),
        );
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseRequests.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.data.update((prev) => prev.filter((item) => item.id !== id));
        }
      });
  }

  onSolicitudCompra(id: any) {
    this.router.navigate(ROUTES.COMPRAS.SOLICITUD(id));
  }

  onSelectStatus(status: any) {
    this.solicitudCompraService.onSetStatusFiltro(status);
    this.onLoadData();
  }

  isPendingView(): boolean {
    return this.statusCompra() === 2;
  }

  isSelected(id: string): boolean {
    return this.selectedSolicitudIds().includes(id);
  }

  async onToggleSelection(id: string, checked: boolean) {
    const result = await this.apiResponseS.onPut(
      Endpoints.PurchaseRequests.presentationSelection(id),
      { selectedForPresentation: checked },
      true,
      true,
    );

    if (!result) return;

    this.data.update((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedForPresentation: checked,
              sortOrder:
                typeof (result as any).sortOrder === "number"
                  ? (result as any).sortOrder
                  : item.sortOrder,
            }
          : item,
      ),
    );

    this.selectedSolicitudIds.set(
      this.data()
        .filter((item) => item.selectedForPresentation)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.id),
    );
  }

  async onToggleAllVisible(checked: boolean) {
    if (!this.isPendingView()) {
      this.selectedSolicitudIds.set([]);
      return;
    }

    const visibleItems = this.data().filter(
      (item) => item.selectedForPresentation !== checked,
    );

    if (visibleItems.length === 0) return;

    for (const item of visibleItems) {
      await this.apiResponseS.onPut(
        Endpoints.PurchaseRequests.presentationSelection(item.id),
        { selectedForPresentation: checked },
        false,
        false,
      );
    }

    this.onLoadData();
  }

  areAllVisibleSelected(): boolean {
    return this.isPendingView() && this.data().length > 0
      ? this.data().every((item) =>
          this.selectedSolicitudIds().includes(item.id),
        )
      : false;
  }

  onPresentationMode() {
    if (this.selectedSolicitudIds().length === 0) return;

    this.router.navigate(ROUTES.COMPRAS.PRESENTACION_SOLICITUDES);
  }

  async onRowReorder(event: any) {
    const reordered = [...this.data()];
    const orderedIds = reordered.map((item: any) => item.id);

    if (orderedIds.length === 0) {
      return;
    }

    const result = await this.apiResponseS.onPut(
      Endpoints.PurchaseRequests.presentationOrder,
      { solicitudCompraIds: orderedIds },
      true,
      true,
    );

    if (!result) {
      this.onLoadData();
      return;
    }

    this.data.update((prev) =>
      prev.map((item, index) => ({ ...item, sortOrder: index })),
    );
    this.selectedSolicitudIds.set(
      this.data()
        .filter((item) => item.selectedForPresentation)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.id),
    );
  }
  onCuadroComparativo(id: string) {
    this.router.navigate(ROUTES.COMPRAS.CUADRO_COMPARATIVO(id));
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

  onCreateOrder(id: any) {
    this.router.navigate([...ROUTES.COMPRAS.ORDEN_COMPRA("0"), id]);
  }

  onViewPurchaseOrder(id: string) {
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(id));
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS
      .openDialog(OrdenCompra, { id }, "", this.dialogHandlerS.sizeFull, true)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onUnlinkPurchaseOrder(ordenCompraId: string) {
    Swal.fire({
      title: "Confirmar",
      text: "óEstá seguro de que desea desvincular esta orden de compra?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desvincular",
      cancelButtonText: "Cancelar",
      customClass: {
        container: "my-swal-container",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiResponseS
          .onPut(Endpoints.PurchaseOrders.unlinkSolicitud(ordenCompraId), {})
          .then((result) => {
            if (result) {
              this.onLoadData();
            }
          });
      }
    });
  }
}
