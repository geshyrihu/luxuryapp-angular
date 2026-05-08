import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { receiptOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ICfdiUseDTO } from "../models/cfdi-use.dto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CfdiUseForm } from "./cfdi-use-form";
import { IonButtonDelete, IonButtonEdit } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-cfdi-use-list",
  templateUrl: "./cfdi-use-list.html",
  imports: [
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
    IonIcon,
  ],
})
export class CfdiUseList implements OnInit {
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<ICfdiUseDTO[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ receiptOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS.onGetList<ICfdiUseDTO[]>(Endpoints.CfdiUses.getAll).then((result) => {
      if(result) this.dataSignal.set(result);
    });
  }

  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.CfdiUses.delete(id)).then((result: boolean) => {
      if (result)
        this.dataSignal.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
    });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(CfdiUseForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}









