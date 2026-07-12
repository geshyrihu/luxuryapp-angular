import { CommonModule, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ProjectedExpensesForm } from "./projected-expenses-form";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";

@Component({
  selector: "app-projected-expenses-list",
  templateUrl: "./projected-expenses-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    CommonModule,
    TableModule,
    DecimalPipe,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomCaption,
    DataViewMobile,
  ],
})
export default class ProjectedExpensesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  dataSignal = signal<any[]>([]);
  ref: DynamicDialogRef;
  loading = signal(true);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    effect(() => {
      this.onLoadData();
    });
  }

  /*
  /PRIME NG TABLE OPTIONS
  */
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  // óEsta es la magia!
  // Se recalcularé automíticamente SOLO si dataSignal cambia.
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList(`projected-expenses/${this.customerIdS.customerId()}`)
      .then((result: any) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(`projected-expenses/${this.customerIdS.customerId()}/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.set(
            this.dataSignal().filter((item) => item.id !== id),
          );
      });
  }

  onModal(data: any) {
    this.dialogHandlerS
      .openDialog(
        ProjectedExpensesForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
