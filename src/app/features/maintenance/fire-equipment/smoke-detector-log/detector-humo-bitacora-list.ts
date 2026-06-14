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
import { DetectorHumoChecklist } from "../smoke-detector-checklist/detector-humo-checklist";

@Component({
  selector: "app-detector-humo-bitacora-list",
  templateUrl: "./detector-humo-bitacora-list.html",
  imports: [
    CommonModule, TableModule, DataViewMobile,
    CustomButtonDelete, CustomButtonEdit,
    PrimeNgCustomCaption, PrimeNgCustomTableFooter, ActionMenu,
    IonItem, IonLabel, IonButtonEdit, IonButtonDelete,
  ],
})
export class DetectorHumoBitacoraList implements OnInit {
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
        if (result) this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(DetectorHumoChecklist, { id: data.id, detectorId: this.detectorId }, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => { if (result) this.onLoadData(); });
  }
}
