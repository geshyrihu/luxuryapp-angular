import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { TableModule } from "primeng/table";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ActionMenu } from "../../../../core/components/action-menu/action-menu";
import { DataViewMobile } from "../../../../core/components/data-view-mobile/data-view-mobile";
import { EmployeeBankDataDTO } from "../models/employee-bank-data.interfaces";
import { EmployeeBankDataFormComponent } from "./employee-bank-data-form";

@Component({
  selector: "app-employee-bank-data-list",
  templateUrl: "./employee-bank-data-list.html",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    DataViewMobile,
    ActionMenu,
    IonButtonItem,
  ],
})
export class EmployeeBankDataList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<EmployeeBankDataDTO[]>([]);
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<
        EmployeeBankDataDTO[]
      >(Endpoints.HR.EmployeeBankData.getAll(this.customerIdS.customerId()))
      .then((result) => {
        if (result) this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        EmployeeBankDataFormComponent,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((result) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.EmployeeBankData.delete(id))
      .then((success) => {
        if (success) {
          this.dataSignal.update((curr) => curr.filter((x) => x.id !== id));
        }
      });
  }
}
