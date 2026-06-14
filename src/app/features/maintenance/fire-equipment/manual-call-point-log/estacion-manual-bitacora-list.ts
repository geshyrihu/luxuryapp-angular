import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields, rowsPerPageOptions, tablePrimeNgRows } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EstacionManualChecklist } from "../manual-call-point-checklist/estacion-manual-checklist";

@Component({
  selector: "app-estacion-manual-bitacora-list",
  templateUrl: "./estacion-manual-bitacora-list.html",
  imports: [
    CommonModule, TableModule, DataViewMobile,
    CustomButtonDelete, CustomButtonEdit,
    PrimeNgCustomCaption, PrimeNgCustomTableFooter, ActionMenu,
    IonItem, IonLabel, IonButtonEdit, IonButtonDelete,
  ],
})
export class EstacionManualBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
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
  ref: DynamicDialogRef;
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

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(EstacionManualChecklist, { id: data.id, stationId: this.stationId }, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => { if (result) this.onLoadData(); });
  }
}
