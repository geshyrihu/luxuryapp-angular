import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { AddFileEstadoFinanciero } from "./add-file-estado-financiero";
import { EstadoFinancieroListDesktop } from "./desktop/estado-financiero-list-desktop";
import { EstadoFinancieroListMobile } from "./mobile/estado-financiero-list-mobile";

@Component({
  selector: "app-estado-financiero-list",
  templateUrl: "./estado-financiero-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EstadoFinancieroListDesktop, EstadoFinancieroListMobile],
})
export class EstadoFinancieroList {
  private authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));

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
    const urlApi = Endpoints.FinancialReports.toCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

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
        this.dialogHandlerS.sizeXl,
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
        Endpoints.FinancialReports.authorize(id, this.authS.applicationUserId),
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
      .onGetItem(Endpoints.FinancialReports.deauthorize(id))
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
        Endpoints.FinancialReports.send(data.id, this.authS.applicationUserId),
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
      true,
    );
  }
}
