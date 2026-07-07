import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints";

// PrimeNG
import { MessageModule } from "primeng/message";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";

// Services
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

interface BulkImportResult {
  processedCount: number;
  successCount: number;
  failedCount: number;
  errors: string[];
}

@Component({
  selector: "app-bulk-import-modal",
  imports: [CommonModule, WebButtonLabel, MessageModule, CustomInputFile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./bulk-import-modal.html",
})
export default class BulkImportModal implements OnInit {
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private toastS = inject(CustomToastService);

  customerId: string = "";
  isLoading = false;
  selectedFile: File | null = null;
  result: BulkImportResult | null = null;

  ngOnInit(): void {
    this.customerId = this.config.data?.customerId;
  }

  onFileSelect(file: File | null) {
    this.selectedFile = file;
  }

  async uploadFile() {
    if (!this.selectedFile || !this.customerId) {
      this.toastS.showWarn("Aviso", "Por favor seleccione un archivo CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    this.isLoading = true;
    this.result = null;

    const res = await this.apiResponseS.onPostFile<BulkImportResult>(
      Endpoints.AccountingCoi.NativeCollection.Charges.bulkImportSaldoInicial(
        this.customerId,
      ),
      formData,
    );

    this.isLoading = false;
    if (res) {
      this.result = res;
    }
  }

  downloadTemplate() {
    const csvContent =
      "PropertyId,Monto,FechaVencimiento,Concepto\n[GUID_AQUI],1500.50,2026-04-01,Saldo Inicial Deuda Histúrica\n[GUID_AQUI],400.00,2026-04-01,Saldo Inicial Abril";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Plantilla_Saldos_Iniciales.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  onClose() {
    this.ref.close(this.result && this.result.successCount > 0);
  }
}
