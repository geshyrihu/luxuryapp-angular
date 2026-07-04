import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PiscinaBitacoraForm } from "./piscina-bitacora-form";
import { MobileActionMenu } from "src/app/core/components/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "src/app/core/components/buttons/mobile-label/button-edit";
import { MobileButtonLabelDelete } from "src/app/core/components/buttons/mobile-label/button-delete";

import { WebButtonIconEdit } from "src/app/core/components/buttons/web-icon/button-edit";
import { WebButtonIconDelete } from "src/app/core/components/buttons/web-icon/button-delete";

@Component({
  selector: "app-piscina-bitacora-list",
  templateUrl: "./piscina-bitacora-list.html",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    PrimeNgCustomCaption,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,

    ActionMenu,
  ],
})
export class PiscinaBitacoraList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  rutaActiva = inject(ActivatedRoute);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  piscinaId: string = "";
  ngOnInit(): void {
    this.piscinaId = this.rutaActiva.snapshot.params.piscinaId;
    this.onLoadData();
  }

  onLoadData() {
    const urlApi = "piscinabitacora/list/" + this.piscinaId;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`piscinabitacora/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PiscinaBitacoraForm,
        {
          id: data.id,
          piscinaId: this.piscinaId,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
