import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { checkmarkCircleOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
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
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { OrdenCompra } from "../orden-compra";
@Component({
  selector: "app-orden-compra-pagadas",
  templateUrl: "./orden-compra-pagadas.html",
  imports: [
    EmptyState,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    SelectButtonModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    SelectModule,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
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
