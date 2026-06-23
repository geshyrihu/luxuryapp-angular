import { CommonModule, DatePipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { BitacoraFiltroFechaForm } from "src/app/core/components/bitacora-filtro-fecha/bitacora-filtro-fecha-form";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields, rowsPerPageOptions, tablePrimeNgRows } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HidranteChecklist } from "../hydrant-checklist/hidrante-checklist";
import { HidranteBitacoraPdfService } from "./hidrante-bitacora-pdf.service";

@Component({
  selector: "app-hidrante-bitacora-list",
  templateUrl: "./hidrante-bitacora-list.html",
  imports: [
    CommonModule, TableModule, DataViewMobile,
    CustomButtonDelete, CustomButtonDownload, CustomButtonEdit,
    PrimeNgCustomCaption, PrimeNgCustomTableFooter, ActionMenu,
    IonItem, IonLabel, CustomButtonEdit, CustomButtonDelete,
    DatePipe,
  ],
})
export class HidranteBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfS = inject(HidranteBitacoraPdfService);
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
  hydrantId = "";

  ngOnInit(): void {
    this.hydrantId = this.rutaActiva.snapshot.params["hydrantId"];
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`BitacoraHidrante/list/${this.hydrantId}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`BitacoraHidrante/${id}`)
      .then((result: boolean) => {
        if (result) this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  async onPdfReport() {
    const result = await this.dialogHandlerS.openDialog<{ from: Date; to: Date }>(
      BitacoraFiltroFechaForm,
      {},
      "Reporte PDF — Bitácora Hidrantes",
      this.dialogHandlerS.sizeSm,
    );
    if (result) await this.pdfS.downloadPdf(this.dataSignal(), result.from, result.to);
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(HidranteChecklist, { id: data.id, hydrantId: this.hydrantId }, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => { if (result) this.onLoadData(); });
  }
}
