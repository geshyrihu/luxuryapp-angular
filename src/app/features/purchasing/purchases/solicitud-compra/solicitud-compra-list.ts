import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cartOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { Subscription } from "rxjs";
import { TooltipModule } from "primeng/tooltip";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { SolicitudCompraService } from "src/app/core/services/solicitud-compra.service";
import { OrdenCompra } from "src/app/features/purchasing/pr/purchase-order/orden-compra";
import Swal from "sweetalert2";
import { PurchaseLinkManager } from "../purchase-link-manager/purchase-link-manager";
@Component({
  selector: "app-solicitud-compra-list",
  templateUrl: "./solicitud-compra-list.html",
  imports: [
    EmptyState,
    CommonModule,
    TableModule,
    TagModule,
    TooltipModule,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
   AppIcon],
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

  public AspRole = EApplicationRole;

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
        Endpoints.PurchaseRequests.listSolicitudCompraByCustomerAndStatus(this.customerIdS.customerId(), this.solicitudCompraService.onGetStatusFiltro()),
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
    this.router.navigateByUrl(`/purchases/solicitud-compra/${id}`);
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
      ? this.data().every((item) => this.selectedSolicitudIds().includes(item.id))
      : false;
  }

  onPresentationMode() {
    if (this.selectedSolicitudIds().length === 0) return;

    this.router.navigate(["/purchases/solicitud-compra-presentacion"]);
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

    this.data.update((prev) => prev.map((item, index) => ({ ...item, sortOrder: index })));
    this.selectedSolicitudIds.set(
      this.data()
        .filter((item) => item.selectedForPresentation)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => item.id),
    );
  }
  onCuadroComparativo(id: string) {
    this.router.navigateByUrl(`/purchases/cuadro-comparativo/${id}`);
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
    this.router.navigateByUrl(`/purchases/orden-compra/${0}/${id}`);
  }

  onViewPurchaseOrder(id: string) {
    this.router.navigateByUrl(`/purchases/orden-compra/${id}`);
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


