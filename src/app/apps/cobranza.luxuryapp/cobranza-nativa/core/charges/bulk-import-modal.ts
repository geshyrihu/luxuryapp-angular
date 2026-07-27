import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { LxMessage } from "@ui/adaptive/message/message";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { PropertyInitialBalanceDTO } from "../../contracts/external-compatibility/interfaces/charge.dto";
import { downloadInitialBalanceTemplate } from "./initial-balance-template.helper";

interface BulkImportResult {
  processedCount: number;
  successCount: number;
  failedCount: number;
  errors: string[];
}

@Component({
  selector: "app-bulk-import-modal",
  imports: [WebButtonLabel, CustomInputFile, LxMessage, AppIcon],
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
      Endpoints.CobranzaCore.Charges.bulkImportSaldoInicial(this.customerId),
      formData,
    );

    setTimeout(() => {
      this.isLoading = false;
      if (res) {
        this.result = res;
      }
    });
  }

  async downloadTemplate() {
    if (!this.customerId) {
      this.toastS.showWarn("Aviso", "No se encontro el customerId activo.");
      return;
    }

    const properties = await this.apiResponseS.onGetItem<PropertyInitialBalanceDTO[]>(
      Endpoints.CobranzaCore.Charges.initialBalanceStatus(this.customerId),
    );

    if (!properties?.length) {
      this.toastS.showWarn(
        "Aviso",
        "No se encontraron propiedades para generar la plantilla.",
      );
      return;
    }

    downloadInitialBalanceTemplate(properties);
  }

  onClose() {
    this.ref.close(this.result && this.result.successCount > 0);
  }
}
