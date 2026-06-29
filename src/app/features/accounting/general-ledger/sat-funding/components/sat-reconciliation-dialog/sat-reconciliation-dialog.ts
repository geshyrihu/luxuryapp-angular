import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { ProgressBarModule } from "primeng/progressbar";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ReconciledItemDTO } from "../../interfaces/sat-reconciliation.dtos";

import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-sat-reconciliation-dialog",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomButton,
    TableModule,
    TagModule,
    MessageModule,
    ProgressBarModule,
    CurrencyPipe,
    DatePipe,
    CardModule,
    CustomInputDateSignal,
  ],
  templateUrl: "./sat-reconciliation-dialog.html",
})
export class SatReconciliationDialog implements OnInit {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  tableScrollHeightS = inject(TableScrollHeightService);

  loading = signal(false);
  // States: config, requesting, waiting, processing, results, error
  step = signal<
    "config" | "requesting" | "waiting" | "processing" | "results" | "error"
  >("config");
  results = signal<ReconciledItemDTO[]>([]);
  statusMessage = signal("");
  errorMessage = signal("");
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  legacyFundingId: string = "";
  private _requestId: string = "";

  // Date selection
  dateRangeControl = new FormControl<Date[] | null>(null);

  // Mode: reconciliation (default) or xml
  mode = signal<"reconciliation" | "xml">("reconciliation");

  get _base() {
    return "satreconciliation";
  }

  ngOnInit() {
    if (this.config.data?.mode) {
      this.mode.set(this.config.data.mode);
    }

    if (this.config.data?.legacyFundingId) {
      this.legacyFundingId = this.config.data.legacyFundingId;
    } else {
      this.step.set("error");
      this.errorMessage.set("No se proporcionó ID de fondeo.");
    }
  }

  async startReconciliation() {
    this.step.set("requesting");
    this.loading.set(true);
    const isXml = this.mode() === "xml";

    this.statusMessage.set(
      isXml
        ? "Solicitando Descarga de XMLs al SAT..."
        : "Solicitando Metadatos al SAT...",
    );
    this.errorMessage.set("");

    try {
      // 1. Prepare Payload with CustomerId
      let payload: any = {
        legacyFundingId: this.legacyFundingId,
        customerId: this.customerIdS.customerId(),
      };

      const dates = this.dateRangeControl.value;
      if (dates && dates.length === 2 && dates[0] && dates[1]) {
        payload.startDate = this.dateS.getDateFormat(dates[0]);
        payload.endDate = this.dateS.getDateFormat(dates[1]);
      }

      // 2. Request (POST)
      const url = isXml
        ? `${this._base}/RequestCfdi`
        : `${this._base}/RequestLegacy`;
      const requestResponse = await this.apiResponseS.onPost<any>(url, payload);

      if (!requestResponse) {
        throw new Error("Error al solicitar la descarga (API failure).");
      }

      // API Response Service already handles isSuccess check usually if returns T, but if returns false...
      // onPost returns T | false. So if it's object, it's success data.
      // Wait, onPost<T> returns T or false. My DTO is SatDownloadResponseDTO.
      // Wait, SatDownloadResponseDTO has 'isSuccess' property? No, ApiResponseDTO wrapper has.
      // onPost returns 'data' of ApiResponseDTO.
      // So requestResponse is SatDownloadResponseDTO (Success=true data).

      // But wait... SatDownloadResponseDTO has Status, Message, RequestId.
      // Backend: RequestLegacyReconciliationAsync returns ApiResponseDTO<SatDownloadResponseDTO>.
      // ApiResponseService.onPost unwraps .Data.

      this._requestId = requestResponse.requestId;

      let dateMsg = "";
      if (requestResponse.startDate && requestResponse.endDate) {
        const s = new Date(requestResponse.startDate).toLocaleDateString();
        const e = new Date(requestResponse.endDate).toLocaleDateString();
        dateMsg = ` (${s} - ${e})`;
      }

      // 3. Waiting
      this.step.set("waiting");
      this.statusMessage.set(
        `Solicitud aceptada (${this._requestId}). Rango validado${dateMsg}. Esperando (5s)...`,
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));

      // 4. Processing (Download)
      this.step.set("processing");
      this.statusMessage.set(
        isXml
          ? "Descargando paquete ZIP..."
          : "Descargando y analizando datos...",
      );

      const processPayload = {
        fundingId: this.legacyFundingId,
        requestId: this._requestId,
        customerId: this.customerIdS.customerId(),
      };

      if (isXml) {
        // Download Blob
        const blobResponse = await this.apiResponseS.onPostBlob(
          `${this._base}/DownloadCfdi`,
          processPayload,
        );

        if (blobResponse) {
          const url = window.URL.createObjectURL(blobResponse);
          const a = document.createElement("a");
          a.href = url;
          a.download = `SAT_XMLs_${this.legacyFundingId}_${this._requestId}.zip`;
          a.click();
          window.URL.revokeObjectURL(url);

          this.statusMessage.set("Descarga completada.");
          this.loading.set(false);
          this.step.set("results");
          this.ref.close();
          this.results.set([]);
        } else {
          throw new Error("No se pudo descargar el archivo ZIP.");
        }
      } else {
        // Legacy Process (JSON)
        const processResponse = await this.apiResponseS.onPost<
          ReconciledItemDTO[]
        >(`${this._base}/ProcessLegacy`, processPayload);

        if (processResponse) {
          this.results.set(processResponse);
          this.step.set("results");
          this.loading.set(false);
        } else {
          throw new Error("No se recibieron resultados.");
        }
      }
    } catch (error: any) {
      this.step.set("error");
      this.errorMessage.set(error.message || "Ocurrió un error desconocido.");
      this.loading.set(false);
    }
  }

  retry() {
    this.startReconciliation();
  }

  close() {
    this.ref.close();
  }
}
