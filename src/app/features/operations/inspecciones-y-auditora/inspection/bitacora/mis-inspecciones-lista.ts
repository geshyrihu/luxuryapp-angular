import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web/label";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

@Component({
  selector: "app-mis-inspecciones-lista",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    ActionMenu,
    CardModule,
    NgbTooltipModule,
    CommonModule,
    CustomInputDateSignal,
    DataViewMobile,
    WebButtonLabelItem,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: "./mis-inspecciones-lista.html",
})
export class MisInspeccionesLista {
  authService = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  dateSelectControl = new FormControl<Date | string>(new Date());

  onLoadData() {
    const dateVal = this.dateSelectControl.value;
    if (dateVal instanceof Date) {
      const year = dateVal.getFullYear();
      const month = String(dateVal.getMonth() + 1).padStart(2, "0");
      const day = String(dateVal.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      this.apiResponseS
        .onGetList(
          Endpoints.InspectionResults.byUserCustomerAndDate(
            this.authService.applicationUserId,
            this.customerIdS.customerId(),
            formattedDate,
          ),
        )
        .then((result: any) => {
          this.dataSignal.set(result);
        });
    }
  }

  onDateChange(newDate: string): void {
    this.dateSelectControl.setValue(new Date(newDate), { emitEvent: false });
    this.onLoadData();
  }
}
