import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TableModule } from "primeng/table";
import { CustomButtonItem } from "src/app/core/components/web/buttons/custom-button-item";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { EmployeeFileSummaryDTO } from "../models/employee-file.interfaces";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";

@Component({
  selector: "app-employee-file-list",
  templateUrl: "./employee-file-list.html",
  imports: [
    EmptyState,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonItem,
    CustomInputSelectSignal,
    ActionMenu,
    DataViewMobile,
    CustomButtonItem,
  ],
})
export class EmployeeFileList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  router = inject(Router);

  dataSignal = signal<EmployeeFileSummaryDTO[]>([]);
  isActiveFilter = signal<boolean | null>(null);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  statusOptions = [
    { label: "Todos", value: null },
    { label: "Activos", value: true },
    { label: "Inactivos", value: false },
  ];

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData(): void {
    const endpoint = Endpoints.HR.EmployeeFile.getAll(
      this.customerIdS.customerId(),
      this.isActiveFilter(),
    );
    this.apiResponseS
      .onGetList<EmployeeFileSummaryDTO[]>(endpoint)
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onStatusChange(event: { value: boolean | null }): void {
    this.isActiveFilter.set(event.value);
    this.onLoadData();
  }

  onViewFile(item: EmployeeFileSummaryDTO): void {
    this.router.navigate(["/recursos-humanos/employee-files", item.id]);
  }

  getStatusBadge(isActive: boolean): string {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-slate-100 text-slate-600 border-slate-200";
  }
}

