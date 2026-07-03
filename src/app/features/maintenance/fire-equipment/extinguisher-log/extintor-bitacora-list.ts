import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelDownload } from "src/app/core/components/buttons/web-label/button-download";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { BitacoraFiltroFechaForm } from "src/app/core/components/web/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ExtintorChecklist } from "../extinguisher-checklist/extintor-checklist";
import { ExtintorBitacoraPdfService } from "./extintor-bitacora-pdf.service";

@Component({
  selector: "app-extintor-bitacora-list",
  templateUrl: "./extintor-bitacora-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    WebButtonLabelDelete,
    WebButtonLabelDownload,
    WebButtonLabelEdit,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    DatePipe,
  ],
})
export class ExtintorBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(ExtintorBitacoraPdfService);
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
  extinguisherId = "";

  ngOnInit(): void {
    this.extinguisherId = this.rutaActiva.snapshot.params["extinguisherId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`BitacoraExtintor/list/${this.extinguisherId}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`BitacoraExtintor/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{
      from: Date;
      to: Date;
    }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF é€” Bitúcora Extintores",
      this.dialogHandlerS.sizeSm,
    );
    if (result)
      await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ExtintorChecklist,
        { id: data.id, extinguisherId: this.extinguisherId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
