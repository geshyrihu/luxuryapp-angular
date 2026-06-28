import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { BitacoraFiltroFechaForm } from "src/app/core/components/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields, rowsPerPageOptions, tablePrimeNgRows } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EstacionManualChecklist } from "../manual-call-point-checklist/estacion-manual-checklist";
import { EstacionManualBitacoraPdfService } from "./estacion-manual-bitacora-pdf.service";

@Component({
  selector: "app-estacion-manual-bitacora-list",
  templateUrl: "./estacion-manual-bitacora-list.html",
  imports: [
    EmptyState,
    CommonModule, TableModule, DataViewMobile,
    CustomButtonDelete, CustomButtonDownload, CustomButtonEdit,
    PrimeNgCustomCaption, PrimeNgCustomTableFooter, ActionMenu,
    IonItem, IonLabel, CustomButtonEdit, CustomButtonDelete,
    DatePipe,
  ],
})
export class EstacionManualBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(EstacionManualBitacoraPdfService);
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
  stationId = "";

  ngOnInit(): void {
    this.stationId = this.rutaActiva.snapshot.params["stationId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`BitacoraEstacionManual/list/${this.stationId}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`BitacoraEstacionManual/${id}`)
      .then((result: boolean) => {
        if (result) this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{ from: Date; to: Date }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF â€” BitÃ¡cora Estaciones Manuales",
      this.dialogHandlerS.sizeSm,
    );
    if (result) await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(EstacionManualChecklist, { id: data.id, stationId: this.stationId }, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => { if (result) this.onLoadData(); });
  }
}
