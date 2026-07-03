import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ETipoGasto } from "src/app/core/enums/tipo-gasto.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

// Definición de un ótem de factura analizada extendido para el frontend
interface AnalyzedInvoiceItem {
  tempId: string;
  xmlFileName: string;
  pdfFileName: string | null;
  status: number; // Coincide con el enum AnalysisStatus
  statusMessage: string;
  providerName: string;
  providerRfc: string;
  total: number;
  subTotal: number;
  iva: number;
  uuid: string;
  serie: string | null;
  folio: string | null;
  invoiceDate: string; // O Date si se parsea
  providerExists: boolean;
  providerId: any | null;
  rawXmlContent: string;

  // Propiedades manejadas como signals en el frontend
  selected: Signal<boolean>;
  tipoGasto: Signal<ETipoGasto>;
  justificacionGasto: Signal<string>;
}

type ModalStatus =
  | "initial"
  | "uploading"
  | "analyzing"
  | "preview"
  | "creating";

@Component({
  selector: "app-funding-upload-invoices-modal",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TableModule,
    TagModule,
    TooltipModule,
    CustomInputCheckSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    WebButtonLabel,
  ],
  templateUrl: "./funding-upload-invoices-modal.html",
  providers: [DialogService],
})
export class FundingUploadInvoicesModal {
  private apiResponseService = inject(ApiResponseService);
  private customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  status = signal<ModalStatus>("initial");
  files = signal<File[]>([]);
  analysisResult = signal<AnalyzedInvoiceItem[]>([]); // Usar la nueva interfaz
  fundingId: string = "";

  tiposGasto = Object.keys(ETipoGasto)
    .filter((key) => !isNaN(Number(ETipoGasto[key])))
    .map((key) => ({ label: key, value: Number(ETipoGasto[key]) }));

  allSelected = signal(false);

  selectedCount = computed(() => {
    if (!this.analysisResult()) return 0;
    return this.analysisResult().filter(
      (item) => item.selected() && (item.status === 0 || item.status === 5),
    ).length;
  });
  createButtonLabel = computed(() => `Crear ${this.selectedCount()} órdenes`);

  constructor() {
    this.fundingId = this.config.data.fundingId;
    effect(() => {
      this.updateAllSelectedState();
    });
  }

  onFileSelect(event: any): void {
    this.files.set([...event.currentFiles]);
    this.status.set("uploading");
    this.onAnalyze();
  }

  onAnalyze(): void {
    this.status.set("analyzing");
    const formData = new FormData();
    this.files().forEach((file) => {
      formData.append("files", file, file.name);
    });

    const customerId = this.customerIdService.customerId();
    this.apiResponseService
      .onPost<any[]>(
        `Funding/analyze-invoices/${customerId}?fundingId=${this.fundingId}`,
        formData,
      )
      .then((result) => {
        if (result) {
          const processedResult: AnalyzedInvoiceItem[] = result.map((item) => ({
            ...item,
            ...item,
            selected: signal(item.status === 0 || item.status === 5), // Convertir a signal
            tipoGasto: signal(item.tipoGasto), // Convertir a signal
            justificacionGasto: signal(item.justificacionGasto), // Convertir a signal
          }));
          this.analysisResult.set(processedResult);
        }
        this.status.set("preview");
      })
      .catch((err) => {
        console.error(err);
        this.status.set("initial");
      });
  }
  async onCreateOrders(): Promise<void> {
    this.status.set("creating");

    const selectedItems = this.analysisResult().filter(
      (item) => item.selected() && (item.status === 0 || item.status === 5),
    );

    if (selectedItems.length === 0) {
      this.status.set("preview");
      return;
    }

    // Procesar archivos PDF a Base64
    const invoicesToCreate = await Promise.all(
      selectedItems.map(async (item) => {
        let rawPdfContent = "";
        if (item.pdfFileName) {
          const file = this.files().find((f) => f.name === item.pdfFileName);
          if (file) {
            rawPdfContent = await this.fileToBase64(file);
          }
        }

        return {
          rawXmlContent: item.rawXmlContent,
          rawPdfContent: rawPdfContent,
          providerId: item.providerId,
          tipoGasto: item.tipoGasto(),
          justificacionGasto: item.justificacionGasto(),
          pdfFileName: item.pdfFileName,
          uuid: item.uuid,
          total: item.total,
        };
      }),
    );

    const requestDto = {
      fundingId: this.fundingId,
      customerId: this.customerIdService.customerId(),
      invoicesToCreate: invoicesToCreate,
    };

    this.apiResponseService
      .onPost("Funding/create-orders-from-invoices", requestDto)
      .then(() => {
        this.ref.close(true);
      })
      .catch((err) => {
        console.error(err);
        this.status.set("preview");
      });
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Eliminar el prefijo "data:application/pdf;base64,"
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  closeDialog(): void {
    this.ref.close();
  }

  onRowSelect(): void {
    this.updateAllSelectedState();
  }

  onSelectAll(event: boolean): void {
    // El evento es el booleano directamente del custom-input-check-signal
    this.allSelected.set(event);
    const updatedResult = this.analysisResult().map((item) => ({
      ...item,
      selected: signal(
        item.status === 0 || item.status === 5 ? event : item.selected(),
      ), // Actualizar la signal
    }));
    this.analysisResult.set(updatedResult);
  }

  private updateAllSelectedState(): void {
    const result = this.analysisResult();
    if (!result || result.length === 0) {
      this.allSelected.set(false);
      return;
    }
    const selectableItems = result.filter(
      (item) => item.status === 0 || item.status === 5,
    );
    if (selectableItems.length === 0) {
      this.allSelected.set(false);
      return;
    }
    const selectedCount = selectableItems.filter((item) =>
      item.selected(),
    ).length;
    this.allSelected.set(selectedCount === selectableItems.length);
  }
}
