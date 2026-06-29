import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { PdfViewerModal } from "src/app/core/components/shared/pdf-viewer-modal/pdf-viewer-modal";
import { PrimeNgCustomToast } from "src/app/core/components/web/primeng-custom-toast/primeng-custom-toast";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service"; // Import added
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { PdfGenerationService } from "src/app/features/purchasing/pr/generator-pdf/pdf-generation.service";
import { PurchaseLinkManager } from "src/app/features/purchasing/pr/purchase-link-manager/purchase-link-manager";
import { OrdenCompraDatosAuthParcial } from "src/app/features/purchasing/pr/purchase-order/parcials/orden-compra-datos-auth-parcial";
import { OrdenCompraDatosCotizacion } from "src/app/features/purchasing/pr/purchase-order/parcials/orden-compra-datos-cotizacion";
import { OrdenCompraDatosPagoParcial } from "src/app/features/purchasing/pr/purchase-order/parcials/orden-compra-datos-pago-parcial";
import { OrdenCompraStatusParcial } from "src/app/features/purchasing/pr/purchase-order/parcials/orden-compra-status-parcial";
import { OrdenCompraDatosPago } from "./forms/orden-compra-datos-pago";
import { OrdenCompraDenegada } from "./forms/orden-compra-denegada";
import { OrdenCompraDetalleAddProducto } from "./forms/orden-compra-detalle-add-producto";
import { OrdenCompraFacturaForm } from "./forms/orden-compra-factura-form";
import { OrdenCompraStatus } from "./forms/orden-compra-status";
import { ModalOrdenCompra } from "./orden-compra-modal";
import { OrdenCompraEditDetalle } from "./orden-compra-edit-detalle";
import { OrdenCompraEditPresupustoUtilizado } from "./orden-compra-edit-presupusto-utilizado";
import { OrdenCompraPresupuesto } from "./orden-compra-presupuesto/orden-compra-presupuesto";
import { OrdenCompraFacturasParcial } from "./parcials/orden-compra-facturas-parcial";
@Component({
  selector: "app-orden-compra",
  templateUrl: "./orden-compra.html",
  imports: [
    EmptyState,
    CardModule,
    CommonModule,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButton, // Nuevo componente importado
    MessageModule,
    OrdenCompraDatosAuthParcial,
    OrdenCompraDatosCotizacion,
    OrdenCompraDatosPagoParcial,
    OrdenCompraStatusParcial,
    OrdenCompraFacturasParcial,
    PrimeNgCustomToast,
    RouterModule,
    TableModule,
    TagModule,
    MessageModule,
    SkeletonModule,
    ProgressSpinnerModule,
  ],
})
export class OrdenCompra implements OnInit {
  //----------------------------------------------------------------
  // 1. INYECCIóN DE DEPENDENCIAS
  //----------------------------------------------------------------
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService); // Inject added
  dialogHandlerS = inject(DialogHandlerService);
  routeActive = inject(ActivatedRoute);
  router = inject(Router);
  confirmationService = inject(ConfirmationService);
  public ordenCompraService = inject(OrdenCompraService); // Póblico para usar sus signals en el template
  public pdfGenerationService = inject(PdfGenerationService);
  //----------------------------------------------------------------
  // 2. SEíALES DE ESTADO (STATE SIGNALS)
  //----------------------------------------------------------------
  // REFACTOR: El estado del componente ahora se gestiona con WritableSignal.
  ordenCompraId: WritableSignal<string> = signal("");
  ordenCompra: WritableSignal<any> = signal(null);
  purchaseOrderBudget: WritableSignal<any[]> = signal([]);
  ordenCompraDetalle: WritableSignal<any[]> = signal([]);
  solicitudCompraId: WritableSignal<string> = signal("");
  loading = signal(false);

  // Validation Signals
  isValidating = signal(false);
  validationResult = signal<any | null>(null);

  // REFACTOR: Propiedades que no se usan o se pueden derivar. Se comentan para posible eliminación.
  // esNumeroNegativo: boolean = false; // Derivado de `ordenCompraService.totalPorCubrir() < 0`, no usado en template.
  // totalRelacionadoConOtras Ordenes: number = 0; // No se usa en el template.
  // esGastoFijo: boolean = false; // No se usa en el template.
  // icon: string = ""; // No se usa en el template.

  //----------------------------------------------------------------
  // 3. SEíALES COMPUTADAS (COMPUTED SIGNALS) PARA LóGICA DE UI
  //----------------------------------------------------------------
  // REFACTOR: Centralizamos la lógica condicional en `computed` signals.
  // Esto limpia el template y hace que la lógica sea mós fócil de mantener.

  /** Indica si la OC estó autorizada. */
  isAuthorized: Signal<boolean> = computed(
    () =>
      this.ordenCompra()?.ordenCompraAuth?.statusOrdenCompra === "Autorizado",
  );

  /** Indica si la OC ha sido revisada por el residente. */
  isReviewedByResident: Signal<boolean> = computed(
    () =>
      (this.ordenCompra()?.ordenCompraAuth?.revisadoPorResidente?.length ?? 0) >
      0,
  );

  /** Indica si la OC estó bloqueada para modificación. */
  isLocked: Signal<boolean> = computed(
    () => this.ordenCompra()?.isLockedForModification ?? false,
  );

  /** Determina si los presupuestos se pueden editar. */
  canEditBudget: Signal<boolean> = computed(
    () => !this.isLocked() && !this.isAuthorized(),
  );

  /** Determina si se pueden agregar nuevos productos. */
  canAddProducts: Signal<boolean> = computed(() => !this.isLocked());

  /** Lógica para mostrar el encabezado de la tabla de presupuesto. */
  canShowBudgetHeader: Signal<boolean> = computed(() => {
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();
    return (
      !this.isLocked() && !this.isReviewedByResident() && totalPorCubrir !== 0
    );
  });

  /** Lógica para deshabilitar los botones de edición de los paneles principales. */
  isPanelEditingDisabled: Signal<boolean> = computed(
    () => this.isLocked() || this.isAuthorized() || this.isReviewedByResident(),
  );

  /** Calcula todos los totales de la OC en una sola señal computada. */
  totals: Signal<{
    subtotal: number;
    iva: number;
    retencionIva: number;
    retencionIsr: number;
    total: number;
  }> = computed(() => {
    const detalle = this.ordenCompraDetalle();
    let subTotal = 0;
    let ivaTotal = 0;
    let retencionIvaTotal = 0;
    let retencionIsrTotal = 0;

    for (const item of detalle) {
      // Calculos por linea
      const itemSubTotal =
        item.cantidad * item.precio * (1 - item.descuento / 100);
      const itemIva = itemSubTotal * (item.ivaAplicado / 100);
      const itemRetencionIva =
        itemSubTotal * (item.retencionIVAPorcentaje / 100);
      const itemRetencionIsr =
        itemSubTotal * (item.retencionISRPorcentaje / 100);

      // Suma a los totales
      subTotal += itemSubTotal;
      ivaTotal += itemIva;
      retencionIvaTotal += itemRetencionIva;
      retencionIsrTotal += itemRetencionIsr;
    }
    const total = subTotal + ivaTotal - retencionIvaTotal - retencionIsrTotal;

    return {
      subtotal: subTotal,
      iva: ivaTotal,
      retencionIva: retencionIvaTotal,
      retencionIsr: retencionIsrTotal,
      total: total,
    };
  });

  ngOnInit(): void {
    const idFromRoute = this.routeActive.snapshot.params.id;
    const id = idFromRoute ?? this.ordenCompraService.getOrdenCompraId();
    this.ordenCompraId.set(id);
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    const ocId = this.ordenCompraId();
    if (!ocId) return;

    this.loading.set(true);
    const result = await this.apiResponseS.onGetItem<any>(
      Endpoints.PurchaseOrders.getById(ocId),
    );

    if (result) {
      // REFACTOR: Actualizamos el estado usando .set() en las signals.
      this.ordenCompra.set(result);
      this.ordenCompraDetalle.set(result.ordenCompraDetalle ?? []);
      this.purchaseOrderBudget.set(result.purchaseOrderBudget ?? []);

      // Actualizamos los totales en el servicio, lo que propagaró los cambios a todos los signals dependientes.
      this.ordenCompraService.actualizarTotalOrdenCompra(ocId);

      if (result.folioSolicitudCompra) {
        const scId = await this.apiResponseS.onGetItem<string>(
          Endpoints.PurchaseRequests.getIdByFolioAndCustomer(result.folioSolicitudCompra, result.customerId),
        );
        this.solicitudCompraId.set(scId ?? "");
      }
    }
    this.loading.set(false);
  }

  // ... Mótodos para abrir modales y realizar acciones ...
  // La lógica interna de estos mótodos no cambia, solo que al final llaman a onLoadData()
  // para refrescar el estado de todas las signals.

  autorizarCompra(): void {
    this.apiResponseS
      .onGetList(
        Endpoints.PurchaseOrders.authorize(this.ordenCompraId(), this.authS.applicationUserId),
      )
      .then((result) => {
        this.ordenCompra.set(result);
        this.onLoadData();
      });
  }

  deautorizarCompra(): void {
    this.apiResponseS
      .onGetList(Endpoints.PurchaseOrders.unauthorize(this.ordenCompraId()))
      .then((result) => {
        this.ordenCompra.set(result);
        this.onLoadData();
      });
  }

  onModalOrdenCompraPresupuesto(): void {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraPresupuesto,
        { ordenCompraId: this.ordenCompraId() },
        "Selecciona partida presupuestal",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => this.onLoadData());
  }

  onModalAgregarproducto(): void {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraDetalleAddProducto,
        { ordenCompraId: this.ordenCompraId() },
        "Agregar producto o Servicio a la Orden de Compra",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => this.onLoadData());
  }

  onDeleteProduct(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseOrderDetails.delete(id))
      .then(() => this.onLoadData());
  }

  // ... (Resto de mótodos onModal..., onDelete..., etc. se mantienen similares, siempre llamando a onLoadData() al final)
  onModalEditarPresupuestoUtilizado(id: any) {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraEditPresupustoUtilizado,
        { id },
        "Actualizar presupuesto utilizado",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onModalEditarDetalle(item: any) {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraEditDetalle,
        { id: item.id },
        item.productName,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onModalOrdenCompra() {
    this.dialogHandlerS
      .openDialog(
        ModalOrdenCompra,
        { ordenCompra: this.ordenCompra() },
        "Actualizar información",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onModalOrdenCompraDatosPago() {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraDatosPago,
        { ordenCompra: this.ordenCompra() },
        "Actualizar Datos de pago",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onModalOrdenCompraStatus() {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraStatus,
        { ordenCompraId: this.ordenCompraId() },
        "Autorizar Status de Orden de compra",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onModalcompraNoAutorizada() {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraDenegada,
        {
          ordenCompraId: this.ordenCompra().id,
          ordenCompraAuthId: this.ordenCompra().ordenCompraAuth.id,
        },
        "Denegar Orden de Compra",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData());
  }
  onDeleteOrdenCompraPresupuesto(id: any): void {
    this.apiResponseS
      .onDelete(Endpoints.PurchaseOrderBudgets.delete(id))
      .then(() => this.onLoadData());
  }
  /** Nómero de columnas del cuerpo de la tabla (10 o 11 segón permisos). */
  tableColumnCount: Signal<number> = computed(() => {
    return this.canEditBudget() ? 11 : 10;
  });

  /** colspan inicial para el footer: (totalCols - 5) = (11-5=6) o (10-5=5). */
  footerInitialColspan: Signal<number> = computed(() => {
    return this.tableColumnCount() - 5; // 6 si canEditBudget(), 5 si no
  });

  onDownloadOrdenCompraPdf(): void {
    this.pdfGenerationService.generateOrdenCompraPdf(this.ordenCompraId());
  }

  onDownloadSolicitudPagoPdf(): void {
    this.pdfGenerationService.generateSolicitudPagoPdf(this.ordenCompraId());
  }

  // --- MóTODOS DE ARCHIVOS Y VALIDACIóN (Traódos de OrdenCompraStatusParcial) ---

  descargarArchivo(url: string): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    link.click();
  }

  viewPdf(url: string, fileName: string): void {
    console.log("Viewing PDF:", url, fileName); // Debug
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true,
    );
  }

  onValidateInvoice(ordenCompraId: string) {
    this.isValidating.set(true);
    this.validationResult.set(null);

    const urlApi = Endpoints.PurchaseOrders.validateInvoice(ordenCompraId);

    this.apiResponseS
      .onPost<ValidationResultDTO>(urlApi, {})
      .then((result: any) => {
        this.validationResult.set(result);
        if (result.isValid) {
          this.customToastService.showSuccess(
            "Validación Exitosa",
            result.message,
          );
        } else {
          this.customToastService.showError(
            "Validación Fallida",
            result.message,
          );
        }
      })
      .catch((error) => {
        console.error("Error en la validación:", error);
        this.customToastService.showError(
          "Error",
          "Error al validar facturas.",
        );
      })
      .finally(() => {
        this.isValidating.set(false);
      });
  }

  onManageInvoices(): void {
    this.dialogHandlerS
      .openDialog(
        OrdenCompraFacturaForm,
        {
          ordenCompraId: this.ordenCompraId(),
          facturas: this.ordenCompra().facturas,
        },
        "Administrar Facturas",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
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
}

export interface ValidationResultDTO {
  isValid: boolean;
  message: string;
  invoiceTotal?: number;
  purchaseOrderTotal?: number;
}



