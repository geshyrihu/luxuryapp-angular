import { CommonModule, DecimalPipe, UpperCasePipe } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MenuItem, SortEvent } from "primeng/api";
import { BadgeModule } from "primeng/badge";
import { DialogModule } from "primeng/dialog";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { MessageModule } from "primeng/message";
import { ProgressBarModule } from "primeng/progressbar"; // Added
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { PdfGenerationService } from "src/app/features/purchasing/po/generator-pdf/pdf-generation.service";
import { CreateOrdenCompraWizard } from "src/app/features/purchasing/po/purchase-order/components/create-orden-compra-wizard/create-orden-compra-wizard";
import { PaymentVoucherModal } from "src/app/features/purchasing/po/purchase-order/components/payment-voucher-modal/payment-voucher-modal";
import { CreateOrdenCompra } from "src/app/features/purchasing/po/purchase-order/create-orden-compra";
import { OrdenCompraDatosPago } from "src/app/features/purchasing/po/purchase-order/forms/orden-compra-datos-pago";
import { OrdenCompra } from "src/app/features/purchasing/po/purchase-order/orden-compra";
import { FundingExcelExportService } from "../../general-ledger/contabilidad/services/funding-excel-export.service";
import { CreateOrdenCompraFueraFondeo } from "./components/create-orden-compra-fuera-fondeo/create-orden-compra-fuera-fondeo";
// import { SatReconciliationDialog } from "../sat-funding/components/sat-reconciliation-dialog/sat-reconciliation-dialog";
import { FundingGroupFiles } from "./components/funding-group-files/funding-group-files.";
import { FundingOrderInvoices } from "./components/funding-order-invoices/funding-order-invoices"; // Added
import { FundingUploadInvoicesModal } from "./components/modal-funding-upload-invoices";
import { FundingDetailDTO, FundingOrdenDTO } from "./model/funding-detail-dto";
const tipoGastoTitles: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "GASTOS FIJOS",
  [ETipoGasto.Variable]: "GASTOS VARIABLES",
  [ETipoGasto.CajaChica]: "CAJA CHICA",
  [ETipoGasto.Extraordinario]: "GASTOS EXTRAORDINARIOS",
  [ETipoGasto.Devoluciones]: "DEVOLUCIONES",
  [ETipoGasto.TarjetaDebito]: "TARJETA DE DÃ³BITO",
  [ETipoGasto.Proyectos]: "GASTOS DE PROYECTOS",
  [ETipoGasto.Nomina]: "NÃ³MINA",
  [ETipoGasto.Impuestos]: "IMPUESTOS Y CONTRIBUCIONES",
};

const tipoGastoEmojis: { [key: number]: string } = {
  [ETipoGasto.Fijo]: "Ã©ÂÃ©",
  [ETipoGasto.Variable]: "ðŸ’¸",
  [ETipoGasto.CajaChica]: "Ã©â„¢",
  [ETipoGasto.Extraordinario]: "âœ¨",
  [ETipoGasto.Devoluciones]: "Ã©â€ Ã©Ã©Â",
  [ETipoGasto.TarjetaDebito]: "ðŸ’³",
  [ETipoGasto.Proyectos]: "Ã©Ââ€”Ã©Â",
  [ETipoGasto.Nomina]: "ðŸ‘¥",
  [ETipoGasto.Impuestos]: "âš–ï¸",
};

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-funding-detail",
  imports: [
    WebButtonIcon,
    WebButtonIconDelete,
    BadgeModule,
    WebButtonLabel,
    CommonModule,

    ReactiveFormsModule,
    DecimalPipe,
    DialogModule,
    MessageModule,
    ProgressBarModule,
    RouterModule,
    SplitButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    UpperCasePipe,
    CustomInputCheckSignal,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-detail.html",
})
export class FundingDetail {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private aspRoleS = inject(AspRoleService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private routeActive = inject(ActivatedRoute);
  private signalRS = inject(SignalRService);
  private ordenCompraService = inject(OrdenCompraService);
  private excelExportService = inject(FundingExcelExportService);
  private pdfGenerationService = inject(PdfGenerationService);
  private customToastS = inject(CustomToastService);
  private destroyRef = inject(DestroyRef);
  private customToastService = inject(CustomToastService);

  loading = signal(true);

  dataSignal = signal<any[]>([]);
  fullData = signal<FundingDetailDTO | null>(null);
  ordenesFueraProceso = signal<FundingOrdenDTO[]>([]);

  isRolAdministrador = this.aspRoleS.roleSignal(EApplicationRole.Administrador);
  isRolSuperUsuario = this.aspRoleS.roleSignal(EApplicationRole.SuperUsuario);
  isRolContador = this.aspRoleS.roleSignal(EApplicationRole.Contador);

  customerName = signal("");
  customerPhoto = signal("");
  periodo = signal("");
  rango = signal("");
  isVerified = signal(false);
  isAuthorized = signal(false);
  isConfirmed = signal(false);
  viewInstructions = signal(false);

  // Download Progress State
  isDownloading = signal(false);
  downloadProgress = signal(0);
  downloadStatusText = signal("");

  id: string = "";

  // Permissions
  canEdit = computed(() => !this.isVerified() && !this.isAuthorized());

  createOrderItems: MenuItem[] = [];

  constructor() {
    this.createOrderItems = Object.keys(ETipoGasto)
      .filter((key) => !isNaN(Number(ETipoGasto[key])))
      .map((key) => {
        const id = Number(ETipoGasto[key]);
        const emoji = tipoGastoEmojis[id] || "??";
        const title = tipoGastoTitles[id] || key;
        return {
          label: `${emoji} ${title}`,
          command: () => this.openCreateOrdenCompraWizard(id),
          class: "p-2",
          disabled: !this.canEdit(), // Disable menu items individually too
        };
      });

    // Efecto reactivo consolidado: se ejecuta cuando cambia el cliente O los parÃ³metros de la ruta
    effect(() => {
      const customerId = this.customerIdS.customerId();
      const isLoaded = this.customerIdS.customerDataReady();
      const params = this.routeParamsSignal();

      // 1. Sincronizar el ID de la ruta
      if (params && params["id"]) {
        this.id = params["id"];
      }

      // 2. Si tenemos ambos parÃ³metros y el cliente estÃ© listo, cargamos
      if (this.id && customerId && isLoaded) {
        this.onLoadData(customerId);
      }
    });

    this.signalRS.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const customerId = this.customerIdS.customerId();
        if (customerId) {
          this.onLoadData(customerId);
        }
      });
  }

  private routeParamsSignal = toSignal(this.routeActive.params);

  showInvoices(orden: any) {
    if (orden.listadoFacturas && orden.listadoFacturas.length > 1) {
      this.dialogHandlerS.openDialog(
        FundingOrderInvoices,
        { invoices: orden.listadoFacturas },
        "Facturas de la Orden",
        this.dialogHandlerS.sizeLg,
      );
    } else if (orden.pdfFile) {
      this.viewPdf(orden.pdfFile, "Factura");
    } else {
      this.customToastS.showInfo(
        "Sin Factura",
        "Esta orden no tiene factura digital adjunta.",
      );
    }
  }

  onShowGroupFiles(grupo: any) {
    this.dialogHandlerS.openDialog(
      FundingGroupFiles,
      { grupo },
      "?? | Facturas y XML",
      this.dialogHandlerS.sizeFull,
      true,
    );
  }

  onShowInstructions() {
    this.viewInstructions.set(!this.viewInstructions());
  }

  onLoadData(customerId: string) {
    const urlApi = `funding/details/${this.id}/${customerId}`;
    this.apiResponseS.onGetList<FundingDetailDTO>(urlApi).then((result) => {
      this.fullData.set(result);
      this.onSetSignalProperty(result);
    });
  }

  onSetSignalProperty(result: any) {
    const gruposConTotales = this.calculateGroupTotals(result.grupos);
    this.dataSignal.set(gruposConTotales);
    this.customerName.set(result.customerName);
    this.customerPhoto.set(result.customerPhoto);
    this.periodo.set(result.periodo);
    this.rango.set(result.rango);
    this.isVerified.set(result.isVerified);
    this.isAuthorized.set(result.isAuthorized);
    this.isConfirmed.set(result.isConfirmed);

    const fueraProceso = (result.ordenesFueraProceso ?? []).map(
      (orden: any) => {
        if (!orden.ordenCompraPagadaControl) {
          orden.ordenCompraPagadaControl = new FormControl(
            orden.ordenCompraPagada,
          );
        } else {
          orden.ordenCompraPagadaControl.setValue(orden.ordenCompraPagada, {
            emitEvent: false,
          });
        }
        return orden;
      },
    );
    this.ordenesFueraProceso.set(fueraProceso);
  }

  calculateGroupTotals(grupos: any[]): any[] {
    if (!grupos) {
      return [];
    }
    return grupos.map((grupo) => {
      const total = grupo.ordenes.reduce(
        (sum: number, orden: any) => sum + (orden.total || 0),
        0,
      );
      const ordenesWithControls = grupo.ordenes.map((orden: any) => {
        if (!orden.ordenCompraPagadaControl) {
          orden.ordenCompraPagadaControl = new FormControl(
            orden.ordenCompraPagada,
          );
        } else {
          orden.ordenCompraPagadaControl.setValue(orden.ordenCompraPagada, {
            emitEvent: false,
          });
        }
        return orden;
      });
      return { ...grupo, ordenes: ordenesWithControls, totalGrupo: total };
    });
  }

  onValidate() {
    const urlApi = `funding/validate/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isVerified.set(true);
      }
    });
  }
  onAuthorize() {
    const urlApi = `funding/authorize/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isAuthorized.set(true);
      }
    });
  }
  onUnvalidate() {
    const urlApi = `funding/unvalidate/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isVerified.set(false);
      }
    });
  }

  onUnauthorize() {
    const urlApi = `funding/unauthorize/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isAuthorized.set(false);
      }
    });
  }

  onConfirm() {
    const urlApi = `funding/confirm/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isConfirmed.set(true);
      }
    });
  }

  onRevokeConfirmation() {
    const urlApi = `funding/revoke-confirmation/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.onLoadData(this.customerIdS.customerId());
        this.isConfirmed.set(false);
      }
    });
  }

  /**
   * Se dispara cuando el usuario cambia el estado de pago de una orden.
   * Llama a la API usando el nuevo mÃ©todo onPatch para persistir el cambio.
   * @param orden El objeto completo de la fila que se estÃ© modificando.
   */
  onPaymentStatusChange(orden: any): void {
    const nuevoEstado = orden.ordenCompraPagadaControl.value;
    const ordenId = orden.ordenCompraId;

    console.log(
      `Ã©â€Â Actualizando estado de pago para OC ID: ${ordenId} a: ${nuevoEstado}`,
    );

    // 1. Preparamos la URL y el cuerpo (body) para la peticiÃ³n PATCH.
    const urlApi = `funding/update-purchase-paid-status/${ordenId}`;
    const body = { isPaid: nuevoEstado };

    // 2. Llamamos a nuestro nuevo y flamante mÃ©todo onPatch.
    //    Tu servicio ya se encarga de los toasts de carga y Ã³xito/error.
    this.apiResponseS.onPatch(urlApi, body).then((success) => {
      // 3. Manejamos el caso de error. Si la API falla, 'success' serÃ© false.
      if (!success) {
        // Ã³CRÃ³TICO! Si la actualizaciÃ³n fallÃ© en el backend,
        // revertimos el cambio en la UI para que no mienta al usuario.
        console.error(
          `FallÃ© la actualizaciÃ³n para la OC ${ordenId}. Revertiendo el cambio en la UI.`,
        );
        orden.ordenCompraPagadaControl.setValue(!nuevoEstado, {
          emitEvent: false,
        });
      }
    });
  }

  onEditPaymentData(ordenCompra: FundingOrdenDTO) {
    const data = {
      ordenCompra: {
        id: ordenCompra.ordenCompraId,
        ordenCompraDatosPago: {
          id: ordenCompra.ordenCompraDatosPagoId,
        },
      },
    };
    this.dialogHandlerS
      .openDialog(
        OrdenCompraDatosPago,
        data,
        "Editar Datos de Pago",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => this.onLoadData(this.customerIdS.customerId()));
  }
  onModalAdd() {
    // 1. Obtenemos el valor de la signal (que es el objeto de parÃ³metros)

    // 2. Extraemos el 'tipo' y lo convertimos a nÃºmero
    const tipoGastoValue = 0;

    // 3. Verificamos que sea un nÃºmero vÃ³lido antes de continuar
    if (isNaN(tipoGastoValue)) {
      console.error("El tipo de gasto en la URL no es un nÃºmero vÃ³lido");
      // Opcional: Mostrar un mensaje de error al usuario
      return;
    }
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompra,
        { tipoGasto: tipoGastoValue }, // ? Ã³AquÃ© estÃ© la magia!
        "Nueva Orden de compra",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  onAddFueraFondeo(): void {
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompraFueraFondeo,
        { fundingId: this.id },
        "OC fuera de proceso de fondeo",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  onRemoveFueraFondeo(ordenCompraId: string): void {
    this.apiResponseS
      .onDelete(`OrdenCompra/${ordenCompraId}/fuera-fondeo`)
      .then((result: boolean) => {
        if (result) this.onLoadData(this.customerIdS.customerId());
      });
  }

  openCreateOrdenCompraWizard(tipoGasto?: ETipoGasto) {
    console.log(
      "Ã©â€Â ~ FundingDetail ~ openCreateOrdenCompraWizard ~ tipoGasto:",
      tipoGasto,
    );
    // Si no se proporciona tipoGasto, no abras el diÃ³logo aÃ³n
    // o muestra un mensaje para que seleccionen del menÃ­
    if (tipoGasto === undefined) {
      // OpciÃ³n 2: Mostrar un mensaje
      this.customToastService.showInfo(
        "Selecciona tipo de gasto",
        "Por favor selecciona un tipo de gasto del menÃ­",
      );
      return;
    }

    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompraWizard,
        { fundingId: this.id, tipoGasto: tipoGasto },
        "Crear Nueva Orden de Compra (Asistente)",
        this.dialogHandlerS.sizeFull,
        true,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.customerIdS.customerId());
        }
      });
  }

  onOrdenCompraModal(id: string) {
    this.ordenCompraService.setOrdenCompraId(id);

    this.dialogHandlerS
      .openDialog(OrdenCompra, { id }, "", this.dialogHandlerS.sizeFull, true)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.customerIdS.customerId());
        }
      });
  }

  onManagePaymentVouchers(orden: any) {
    this.dialogHandlerS
      .openDialog(
        PaymentVoucherModal,
        {
          ordenCompraId: orden.ordenCompraId,
          comprobantes: orden.comprobantesPago,
        },
        "Gestionar Pagos",
        this.dialogHandlerS.sizeMd,
      )
      .then((res) => {
        if (res) {
          this.onLoadData(this.customerIdS.customerId());
        }
      });
  }

  onDownloadFileExcel() {
    const data = this.fullData();
    if (data) {
      this.excelExportService.exportToExcel(data);
    } else {
      console.error("No hay datos disponibles para exportar.");
    }
  }

  onDownloadFilePdf() {
    const urlApi = `fundingfile/pdf/${this.id}`;
    const nameReport = this.periodo() + ".pdf";
    this.apiResponseS.onDownloadFile(urlApi, nameReport);
  }
  onDownloadInvoces() {
    const urlApi = `fundingfile/invoices/${this.id}`; // Nota: "invoices" plural y coincidir con backend
    const nameReport = this.periodo() + "_Facturas.zip";
    this.apiResponseS.onDownloadFile(urlApi, nameReport);
  }

  onDownloadAllSolicitudesPago() {
    const allOrdenes = this.dataSignal().flatMap((grupo) => grupo.ordenes);
    const total = allOrdenes.length;

    if (total === 0) {
      this.customToastS.showWarn(
        "Sin Ã³rdenes",
        "No hay Ã³rdenes para descargar.",
      );
      return;
    }

    this.isDownloading.set(true);
    this.downloadProgress.set(0);
    this.downloadStatusText.set(
      `Iniciando descarga de ${total} solicitudes...`,
    );

    let completed = 0;
    let delay = 0;

    allOrdenes.forEach((orden) => {
      setTimeout(() => {
        this.pdfGenerationService.generateSolicitudPagoPdf(orden.ordenCompraId);

        completed++;
        const percent = Math.round((completed / total) * 100);
        this.downloadProgress.set(percent);
        this.downloadStatusText.set(`Descargando ${completed} de ${total}...`);

        if (completed === total) {
          setTimeout(() => {
            this.isDownloading.set(false);
            this.customToastS.showSuccess(
              "Descarga Completa",
              "Se han generado todas las solicitudes.",
            );
          }, 1000);
        }
      }, delay);
      delay += 1500;
    });
  }

  onRowReorder(event: any) {
    const allOrderedIds = this.dataSignal()
      .flatMap((grupo) => grupo.ordenes)
      .map((orden) => orden.ordenCompraId);

    this.apiResponseS
      .onPut(`funding/update-order`, { ids: allOrderedIds })
      .then(() => {
        this.onLoadData(this.customerIdS.customerId());
      });
  }

  onDeleteOrder(id: any) {
    this.apiResponseS.onDelete(Endpoints.Funding.deleteDetail(id)).then(() => {
      this.onLoadData(this.customerIdS.customerId());
    });
  }

  // onConciliate() {
  //   if (!this.fullData()) return;

  //   this.dialogHandlerS.openDialog(
  //     SatReconciliationDialog,
  //     {
  //       legacyFundingId: this.id,
  //       mode: "reconciliation",
  //     },
  //     "ConciliaciÃ³n SAT",
  //     this.dialogHandlerS.sizeLg,
  //   );
  // }

  // onDownloadXml() {
  //   if (!this.fullData()) return;

  //   this.dialogHandlerS.openDialog(
  //     SatReconciliationDialog,
  //     {
  //       legacyFundingId: this.id,
  //       mode: "xml",
  //     },
  //     "Descarga Masiva XML",
  //     this.dialogHandlerS.sizeLg,
  //   );
  // }

  viewPdf(url: string, fileName: string): void {
    if (!url) {
      console.warn("No PDF URL provided");
      return;
    }
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true, // ? autoMaximize = true
    );
  }

  customSort(event: SortEvent) {
    if (!event.field || !this.dataSignal()) return;

    const sortedGrupos = this.dataSignal().map((grupo) => {
      const sortedOrdenes = [...grupo.ordenes].sort((data1, data2) => {
        let value1: any = data1[event.field! as keyof FundingOrdenDTO];
        let value2: any = data2[event.field! as keyof FundingOrdenDTO];
        let result = 0;

        if (event.field === "indice") {
          const parsed1 = this.parseIndice(data1.indice);
          const parsed2 = this.parseIndice(data2.indice);

          if (parsed1 == null && parsed2 != null) result = -1;
          else if (parsed1 != null && parsed2 == null) result = 1;
          else if (parsed1 == null && parsed2 == null) result = 0;
          else if (parsed1! > parsed2!) result = 1;
          else if (parsed1! < parsed2!) result = -1;
        } else {
          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else if (typeof value1 === "string" && typeof value2 === "string")
            result = value1.localeCompare(value2);
          else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
        }

        return (event.order || 1) * result;
      });
      return { ...grupo, ordenes: sortedOrdenes };
    });

    this.dataSignal.set(sortedGrupos);
  }

  private parseIndice(indice: string | undefined | null): number | null {
    if (!indice) {
      return null;
    }
    const parts = indice.split(".");
    if (parts.length === 2) {
      const major = parseInt(parts[0], 10);
      const minor = parseInt(parts[1], 10);
      if (!isNaN(major) && !isNaN(minor)) {
        return major * 1000 + minor;
      }
    }
    return null;
  }

  onOpenUploadModal() {
    this.dialogHandlerS
      .openDialog(
        FundingUploadInvoicesModal,
        { fundingId: this.id },
        "Crear Ã³rdenes de Compra desde Facturas",
        this.dialogHandlerS.sizeLg,
        true,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData(this.customerIdS.customerId());
        }
      });
  }
}
