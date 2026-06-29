import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PaymentMethodForm } from "./payment-method-form";
import { Endpoints } from "src/app/core/constants/endpoints";
import { IPaymentMethodDTO } from "../models/payment-method.dto";

@Component({
  selector: "app-payment-method-list",
  templateUrl: "./payment-method-list.html",
  imports: [
    EmptyState,
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    CustomButtonDelete,
    CustomButtonEdit,
  ],
})
export class PaymentMethodList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  tableScrollHeightS = inject(TableScrollHeightService);
  data = signal<IPaymentMethodDTO[]>([]);

  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS.onGetList<IPaymentMethodDTO[]>(Endpoints.PaymentMethods.getAll).then((result) => {
      if(result) this.data.set(result);
    });
  }

  onDelete(id: any) {
    this.apiResponseS.onDelete(Endpoints.PaymentMethods.delete(id)).then((result: boolean) => {
      if (result)
        this.data.update((currentData) =>
          currentData.filter((item) => item.id !== id),
        );
    });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PaymentMethodForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}










