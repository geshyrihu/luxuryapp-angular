import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkCircleOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { TableModule } from "primeng/table";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { ActionMenu } from "@ui/web/action-menu/action-menu";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { OrdenCompra } from "../orden-compra";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";

import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-orden-compra-pagadas",
  templateUrl: "./orden-compra-pagadas.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconEdit,
    MobileActionMenu,
    MobileButtonLabelEdit,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectButton,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    WebButtonLabelEdit,
    SelectModule,
    DataViewMobile,
    ActionMenu,
    WebButtonLabelEdit,
    IonItem,
    IonLabel,
  ],
})
export class OrdenCompraPagadas {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  ordenCompraService = inject(OrdenCompraService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  tipoControl = new FormControl<number>(1);
  ref: DynamicDialogRef;

  constructor() {
    addIcons({ checkmarkCircleOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) {
        this.onLoadData(1);
      }
    });
  }
  onLoadData(type: any) {
    const urlApi = `OrdenCompra/Pagadas/${this.customerIdS.customerId()}/${type}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onAddOrEdit(id: any) {
    this.ordenCompraService.setOrdenCompraId(id);
    this.dialogHandlerS
      .openDialog(
        OrdenCompra,
        {
          id,
        },
        "Editar Orden de Compra",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData(this.tipoControl.value);
      });
  }
}
