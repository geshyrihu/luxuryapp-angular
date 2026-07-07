import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import {
  WebButtonLabelConfirm,
  WebButtonLabelItem,
} from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AddFileEstadoFinanciero } from "./add-file-estado-financiero";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabelConfirm } from "@ui/buttons/mobile-label/button-confirm";

import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { TooltipModule } from "primeng/tooltip";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-estado-financiero-list",
  templateUrl: "./estado-financiero-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIcon,
    WebButtonIconConfirm,
    TooltipModule,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelConfirm,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    WebButtonLabel,
    NgbTooltipModule,
    TagModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelConfirm,
    DataViewMobile,
    CardModule,

    WebButtonLabelConfirm,
    WebButtonLabelItem,
  ],
})
export class EstadoFinancieroList {
  private authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  // Signals para controlar el estado de procesamiento de cada acción
  processingUpload = signal<Set<string>>(new Set());
  processingAuthorize = signal<Set<string>>(new Set());
  processingDesauthorize = signal<Set<string>>(new Set());
  processingSend = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData(): void {
    const urlApi = `FinancialReport/ToCustomer/${this.customerIdS.customerId()}/`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  // Función para verificar si un botún esté procesando
  isProcessingUpload(id: string): boolean {
    return this.processingUpload().has(id);
  }

  isProcessingAuthorize(id: string): boolean {
    return this.processingAuthorize().has(id);
  }

  isProcessingDesauthorize(id: string): boolean {
    return this.processingDesauthorize().has(id);
  }

  isProcessingSend(id: string): boolean {
    return this.processingSend().has(id);
  }

  // Función para abrir un cuadro de diólogo modal para agregar el archivo
  onUploadFile(data: any) {
    if (this.isProcessingUpload(data.id)) return;

    const currentSet = new Set(this.processingUpload());
    currentSet.add(data.id);
    this.processingUpload.set(currentSet);

    this.dialogHandlerS
      .openDialog(
        AddFileEstadoFinanciero,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      })
      .finally(() => {
        const updatedSet = new Set(this.processingUpload());
        updatedSet.delete(data.id);
        this.processingUpload.set(updatedSet);
      });
  }

  onAuthorize(id: string) {
    if (this.isProcessingAuthorize(id)) return;

    const currentSet = new Set(this.processingAuthorize());
    currentSet.add(id);
    this.processingAuthorize.set(currentSet);

    this.apiResponseS
      .onGetItem(
        `FinancialReport/Authorize/${id}/${this.authS.applicationUserId}`,
      )
      .then((_) => {
        this.onLoadData();
      })
      .finally(() => {
        const updatedSet = new Set(this.processingAuthorize());
        updatedSet.delete(id);
        this.processingAuthorize.set(updatedSet);
      });
  }

  onDesauthorize(id: string) {
    if (this.isProcessingDesauthorize(id)) return;

    const currentSet = new Set(this.processingDesauthorize());
    currentSet.add(id);
    this.processingDesauthorize.set(currentSet);

    this.apiResponseS
      .onGetItem(`FinancialReport/Desauthorize/${id}`)
      .then((_) => {
        this.onLoadData();
      })
      .finally(() => {
        const updatedSet = new Set(this.processingDesauthorize());
        updatedSet.delete(id);
        this.processingDesauthorize.set(updatedSet);
      });
  }

  onSendEstadosFinancieros(data: any) {
    if (this.isProcessingSend(data.id)) return;

    const currentSet = new Set(this.processingSend());
    currentSet.add(data.id);
    this.processingSend.set(currentSet);

    this.apiResponseS
      .onPost(
        `FinancialReport/Send/${data.id}/${this.authS.applicationUserId}`,
        null,
      )
      .then((_) => {
        this.onLoadData();
      })
      .finally(() => {
        const updatedSet = new Set(this.processingSend());
        updatedSet.delete(data.id);
        this.processingSend.set(updatedSet);
      });
  }

  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName,
      this.dialogHandlerS.sizeFull,
      true, // éé€éÂ autoMaximize = true
    );
  }
}
