import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SwalService } from "@core/services/swal.service";
import { PurchaseLinkManager } from "@purchases.luxuryapp/purchase-orders/purchase-link-manager/purchase-link-manager";
import { OrdenCompra } from "@purchases.luxuryapp/purchase-orders/purchase-order/orden-compra";
import { OrdenCompraService } from "@purchases.luxuryapp/purchase-orders/services/orden-compra.service";
import { TagSeverity } from "@ui/core/tag.base";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { addIcons } from "ionicons";
import { cartOutline } from "ionicons/icons";
import { Subscription } from "rxjs";
import { ROUTES } from "src/app/routing/route-paths";
import { SolicitudCompraListDesktop } from "./desktop/solicitud-compra-list-desktop";
import { SolicitudCompraListMobile } from "./mobile/solicitud-compra-list-mobile";
import { NIVEL_PRIORIDAD_TAG_OPTIONS } from "./nivel-prioridad-tag-options";
import { SolicitudCompraService } from "./services/solicitud-compra.service";
import { TIPO_SOLICITUD_TAG_OPTIONS } from "./tipo-solicitud-tag-options";

@Component({
  selector: "app-solicitud-compra-list",
  templateUrl: "./solicitud-compra-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SolicitudCompraListDesktop, SolicitudCompraListMobile],
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
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  public AspRole = ApplicationRole;

  globalFilterFields: string[] = [
    "folio",
    "solicita",
    "equipoOInstalacion",
    "justificacionGasto",
    "ordenesRelacionadas.folio",
  ];
  loading = signal(true);
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

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta solicitud de compra?",
    );
    if (!ok) return;
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

  isInPresentation(id: string): boolean {
    return this.data().some(
      (item) => item.id === id && item.selectedForPresentation,
    );
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
    return this.data().length > 0
      ? this.data().every((item) =>
          this.data().some(
            (d) => d.id === item.id && d.selectedForPresentation,
          ),
        )
      : false;
  }

  onPresentationMode() {
    if (this.selectedSolicitudIds().length === 0) return;

    this.router.navigate(ROUTES.COMPRAS.PRESENTACION_SOLICITUDES);
  }

  async onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.data()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    reordered.splice(event.dropIndex, 0, moved);
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

    this.data.set(
      reordered.map((item, index) => ({ ...item, sortOrder: index })),
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

  isAuthorizedView(): boolean {
    return this.statusCompra() === 0;
  }

  onAuthorizationDetail(item: any) {
    SwalService.show({
      title: `Autorización ${item.folio}`,
      text: [
        `Autorizada por: ${item.autorizadaPorDisplay || "Sin registro"}`,
        `Fecha: ${item.fechaAutorizacion || "Sin registro"}`,
        `Hora: ${item.horaAutorizacion || "Sin registro"}`,
      ].join("\n"),
      icon: "info",
      confirmButtonText: "Cerrar",
    });
  }

  onDesauthorize(item: any) {
    SwalService.show({
      title: "Desautorizar solicitud",
      text: `La solicitud ${item.folio} volverá a estado pendiente.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Desautorizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.apiResponseS
        .onPut(Endpoints.PurchaseRequests.cuadroComparativoUpdate(item.id), {
          estatus: 2,
          autorizadaPor: null,
          motivoNoAutorizacion: "",
          applicationUserId: this.authS.applicationUserId,
        })
        .then((response) => {
          if (response) this.onLoadData();
        });
    });
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
    SwalService.show({
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
