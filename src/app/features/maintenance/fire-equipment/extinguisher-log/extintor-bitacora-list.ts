import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { BitacoraFiltroFechaForm } from "src/app/core/components/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
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
    IonButtonEdit,
    IonButtonDelete,
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
          this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{ from: Date; to: Date }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF — Bitácora Extintores",
      this.dialogHandlerS.sizeSm,
    );
    if (result) await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
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
