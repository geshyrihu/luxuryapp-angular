import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxCheckbox } from "@ui/adaptive/checkbox/checkbox";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button"; // Added
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-funding-group-files",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectButton,
    LxCheckbox,
    TableModule,
    TooltipModule,
    WebButtonLabel,
    WebButtonIconItem,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./funding-group-files.html",
})
export class FundingGroupFiles implements OnInit {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dialogHandlerS = inject(DialogHandlerService);
  selectedGroupFiles = signal<any[]>([]);
  viewOptions: any[] = [
    { icon: "mdi:grid", value: "grid" },
    { icon: "mdi:format-list-bulleted", value: "list" },
  ];
  viewMode = signal("grid");
  selectedFiles = signal<any[]>([]);

  viewModeControl = new FormControl("grid");
  selectedFilesControl = new FormControl<any[]>([]);

  constructor() {
    this.viewModeControl.valueChanges.subscribe((v) =>
      this.viewMode.set(v || "grid"),
    );
    this.selectedFilesControl.valueChanges.subscribe((v) =>
      this.selectedFiles.set(v || []),
    );
  }

  ngOnInit(): void {
    if (this.config.data && this.config.data.grupo) {
      this.processGroupFiles(this.config.data.grupo);
    }
  }

  processGroupFiles(grupo: any) {
    const files: any[] = [];

    grupo.ordenes.forEach((orden: any) => {
      const folioOrden = orden.folio || `OC-${orden.ordenCompraId}`;
      const providerName = orden.nameProvider || "Proveedor Desconocido";
      const indice = orden.indice || "Indice Desconocido";

      // Archivos de la lista detallada
      if (orden.listadoFacturas && orden.listadoFacturas.length > 0) {
        orden.listadoFacturas.forEach((fac: any) => {
          const name = this.getShortName(fac.folioFiscal || fac.factura);
          if (fac.pdfFile) {
            files.push({
              type: "pdf",
              displayName: `${name}.pdf`,
              fullName: fac.folioFiscal,
              url: fac.pdfFile,
              folioOrden: folioOrden,
              indice: indice,
              ordenCompraId: orden.ordenCompraId,
              providerName: providerName,
            });
          }
          if (fac.xmlFile) {
            files.push({
              type: "xml",
              displayName: `${name}.xml`,
              fullName: fac.folioFiscal,
              url: fac.xmlFile,
              folioOrden: folioOrden,
              ordenCompraId: orden.ordenCompraId,
              providerName: providerName,
            });
          }
        });
      }
      // Fallback al archivo principal si no hay lista (compatibilidad)
      else if (orden.pdfFile) {
        const name = this.getShortName(orden.factura || orden.folioFiscal);
        files.push({
          type: "pdf",
          displayName: `${name}.pdf`,
          fullName: orden.factura,
          url: orden.pdfFile,
          folioOrden: folioOrden,
          ordenCompraId: orden.ordenCompraId,
          providerName: providerName,
        });
      }
    });

    this.selectedGroupFiles.set(files);
  }

  isFileSelected(file: any): boolean {
    return (this.selectedFilesControl.value ?? []).includes(file);
  }

  toggleFileSelection(file: any, checked: boolean): void {
    const current = this.selectedFilesControl.value ?? [];
    const next = checked
      ? [...current, file]
      : current.filter((f) => f !== file);
    this.selectedFilesControl.setValue(next);
  }

  getShortName(text: string): string {
    if (!text) return "SinFolio";
    if (text.length > 5) return text.slice(-5);
    return text;
  }

  downloadSelectedFiles() {
    if (this.selectedFiles().length === 0) return;

    // Descarga secuencial bósica
    this.selectedFiles().forEach((file) => {
      this.descargarArchivo(file.url);
    });
  }

  apiResponseS = inject(ApiResponseService);

  downloadAllFiles() {
    const files = this.selectedGroupFiles();
    if (!files || files.length === 0) return;

    const uniqueOrderIds = [...new Set(files.map((f: any) => f.ordenCompraId))];
    if (uniqueOrderIds.length === 0) return;

    this.apiResponseS.onDownloadFilePost(
      "Funding/download-bulk-invoices-zip",
      uniqueOrderIds,
      "Facturas_Agrupadas.zip",
    );
  }

  descargarArchivo(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    link.target = "_blank";
    link.click();
  }

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
      true,
    );
  }

  close() {
    this.ref.close();
  }
}
