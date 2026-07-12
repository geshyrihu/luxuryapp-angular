import { Endpoints } from "src/app/core/constants/endpoints";
import { CommonModule, DecimalPipe, UpperCasePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { TableModule } from "primeng/table";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { FundingPurchaseDetail } from "src/app/apps/contabilidad.luxuryapp/fondeos-y-reporteo/funding/funding-purchase-detail";
import { FundingDetailDTO } from "src/app/apps/contabilidad.luxuryapp/fondeos-y-reporteo/funding/model/funding-detail-dto";
import { FundingExcelExportService } from "src/app/apps/contabilidad.luxuryapp/general-ledger/funding-excel-export.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { SignalRService } from "src/app/core/services/signalr.service";
@Component({
  selector: "app-funding-accounting-detail",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputCheckSignal,
    UpperCasePipe,
    DecimalPipe,
    WebButtonLabel,
    WebButtonLabelItem,
    LxTag,
    LxMessage,
  ],
  styleUrls: ["./funding-accounting-detail.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-accounting-detail.html",
})
export class FundingAccountingDetail {
  routeActive = inject(ActivatedRoute);
  dialogHandlerS = inject(DialogHandlerService);
  destroyRef = inject(DestroyRef); // Para la limpieza automítica de suscripciones.
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  signalRS = inject(SignalRService);
  excelExportService = inject(FundingExcelExportService);
  loading = signal(true);

  dataSignal = signal<any[]>([]);
  fullData = signal<FundingDetailDTO | null>(null);

  customerName = signal("");
  customerPhoto = signal("");
  periodo = signal("");
  rango = signal("");
  isVerified = signal(false);
  verifiedBy = signal("");
  isAuthorized = signal(false);
  authorizedBy = signal("");
  isConfirmed = signal(false);
  inProgress = signal(true);

  viewInstructions = signal(false);

  id: string = "";

  private routeParamsSignal = toSignal(this.routeActive.params);

  constructor() {
    // Efecto reactivo: cuando el customerId esté listo y cargado, carga los datos
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      const isLoaded = this.customerIdS.customerDataReady();
      if (customerId && isLoaded) {
        this.onLoadData(customerId);
      }
    });
    this.signalRS.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onLoadData(this.customerIdS.customerId());
      });
    effect(() => {
      const params = this.routeParamsSignal();
      if (params) {
        this.id = params["id"];
      }
    });
  }

  onLoadData(customerId: string) {
    const urlApi = Endpoints.RefactorContabilidad.fundingDetailsByIdById(this.id, customerId);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.fullData.set(result);
      this.onSetSignalProperty(result);
    });
  }

  onSetSignalProperty(result: any) {
    const gruposConControls = result.grupos.map((grupo: any) => {
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
      return { ...grupo, ordenes: ordenesWithControls };
    });
    this.dataSignal.set(gruposConControls);
    this.customerName.set(result.customerName);
    this.customerPhoto.set(result.customerPhoto);
    this.periodo.set(result.periodo);
    this.rango.set(result.rango);
    this.isVerified.set(result.isVerified);
    this.verifiedBy.set(result.verifiedBy);
    this.authorizedBy.set(result.authorizedBy);
    this.isAuthorized.set(result.isAuthorized);
    this.isConfirmed.set(result.isConfirmed);
    this.inProgress.set(result.inProgress);
  }
  viewPDF(url: string): void {
    if (!url) return;
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: "factura" },
      "factura",
      this.dialogHandlerS.sizeFull,
      true, // ? autoMaximize = true
    );
  }

  onDownloadFilePdf() {
    const urlApi = Endpoints.RefactorContabilidad.fundingfilePdfById(this.id);
    const nameReport = this.periodo() + ".pdf";
    this.apiResponseS.onDownloadFile(urlApi, nameReport);
  }
  onDownloadInvoces() {
    const urlApi = Endpoints.RefactorContabilidad.fundingfileInvoicesById(this.id); // Nota: "invoices" plural y coincidir con backend
    const nameReport = this.periodo() + "_Facturas.zip";
    this.apiResponseS.onDownloadFile(urlApi, nameReport);
  }

  onConfirmed() {
    const urlApi = Endpoints.RefactorContabilidad.fundingConfirmById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.isConfirmed.set(false);
      }
    });
  }
  onRevokeConfirmation() {
    const urlApi = Endpoints.RefactorContabilidad.fundingRevokeConfirmationById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.isConfirmed.set(false);
      }
    });
  }
  onCompleted() {
    const urlApi = Endpoints.RefactorContabilidad.fundingCompletedById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.inProgress.set(false);
      }
    });
  }
  onRevertComplete() {
    const urlApi = Endpoints.RefactorContabilidad.fundingRevertCompleteById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: boolean) => {
      if (result) {
        this.inProgress.set(false);
      }
    });
  }
  onShowPurchaseDetails(ordenCompraId: string) {
    this.dialogHandlerS.openDialog(
      FundingPurchaseDetail,
      { ordenCompraId: ordenCompraId },
      "Detalles de la Orden de Compra",
      this.dialogHandlerS.sizeFull,
    );
  }

  onDownloadFileExcel() {
    const data = this.fullData();
    if (data) {
      this.excelExportService.exportToExcel(data);
    } else {
      console.error("No hay datos disponibles para exportar.");
    }
  }

  /**
   * Se dispara cuando el usuario cambia el estado de pago de una orden.
   * Llama a la API usando el nuevo método onPatch para persistir el cambio.
   * @param orden El objeto completo de la fila que se esté modificando.
   */
  onPaymentStatusChange(orden: any): void {
    const nuevoEstado = orden.ordenCompraPagadaControl.value;
    const ordenId = orden.ordenCompraId;

    console.log(
      `? Actualizando estado de pago para OC ID: ${ordenId} a: ${nuevoEstado}`,
    );

    // 1. Preparamos la URL y el cuerpo (body) para la petición PATCH.
    const urlApi = Endpoints.RefactorContabilidad.fundingUpdatePurchasePaidStatusById(ordenId);
    const body = { isPaid: nuevoEstado };

    // 2. Llamamos a nuestro nuevo y flamante método onPatch.
    //    Tu servicio ya se encarga de los toasts de carga y óxito/error.
    this.apiResponseS.onPatch(urlApi, body).then((success) => {
      // 3. Manejamos el caso de error. Si la API falla, 'success' seré false.
      if (!success) {
        // óCRóTICO! Si la actualización fallé en el backend,
        // revertimos el cambio en la UI para que no mienta al usuario.
        console.error(
          `Fallé la actualización para la OC ${ordenId}. Revertiendo el cambio en la UI.`,
        );
        orden.ordenCompraPagadaControl.setValue(!nuevoEstado, {
          emitEvent: false,
        });
      }
    });
  }
}
