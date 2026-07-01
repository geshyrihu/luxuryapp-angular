import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { BitacoraFiltroFechaForm } from "src/app/core/components/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { CustomButtonDownload } from "src/app/core/components/web/buttons/custom-button-download";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DetectorHumoChecklist } from "../smoke-detector-checklist/detector-humo-checklist";
import { DetectorHumoBitacoraPdfService } from "./detector-humo-bitacora-pdf.service";

@Component({
  selector: "app-detector-humo-bitacora-list",
  templateUrl: "./detector-humo-bitacora-list.html",
  imports: [
    EmptyState,
    CommonModule,
    TableModule,
    DataViewMobile,
    CustomButtonDelete,
    CustomButtonDownload,
    CustomButtonEdit,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    IonItem,
    IonLabel,
    CustomButtonEdit,
    CustomButtonDelete,
    DatePipe,
  ],
})
export class DetectorHumoBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(DetectorHumoBitacoraPdfService);
  rutaActiva = inject(ActivatedRoute);

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  detectorId = "";

  ngOnInit(): void {
    this.detectorId = this.rutaActiva.snapshot.params["detectorId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`BitacoraDetectorHumo/list/${this.detectorId}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`BitacoraDetectorHumo/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{ from: Date; to: Date }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF ââ‚¬â€ Bitácora Detectores de Humo",
      this.dialogHandlerS.sizeSm,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        DetectorHumoChecklist,
        { id: data.id, detectorId: this.detectorId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

