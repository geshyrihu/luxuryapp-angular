import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";

import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import type {
  CobranzaOnlineInspectionResponse,
  CobranzaOnlineInspectionRow,
} from "../../models/cobranza-online-inspection.model";
import { CobranzaOnlineInspectionHistoryModal } from "./cobranza-online-inspection-history-modal";

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-cobranza-online-inspection",
  templateUrl: "./cobranza-online-inspection.html",
  imports: [
    WebButtonIcon,
    TooltipModule,
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
    WebButtonLabel,
  ],
})
export class CobranzaOnlineInspection {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonth = signal(4);
  readonly loading = signal(true);
  readonly inspection = signal<CobranzaOnlineInspectionResponse | null>(null);
  readonly selectedRow = signal<CobranzaOnlineInspectionRow | null>(null);

  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());
  readonly rows = computed(() => this.inspection()?.rows ?? []);
  readonly globalFilterFields = computed(() => [
    "accountNumber",
    "departmentCode",
    "ownerName",
    "displayName",
    "towerName",
    "lastConcept",
  ]);
  readonly movementFilterFields = computed(() => [
    "policyType",
    "policyNumber",
    "policyConcept",
    "concept",
    "movementType",
    "related401Accounts",
  ]);
  readonly currentCutLabel = computed(
    () => `${this.currentMonth().toString().padStart(2, "0")}/${this.currentYear()}`,
  );
  readonly currentMonthName = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth() - 1, 1);
    return date.toLocaleDateString("es-MX", { month: "long" });
  });

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (!customerId) {
        this.inspection.set(null);
        this.selectedRow.set(null);
        this.loading.set(false);
        return;
      }

      void this.onLoadData(customerId);
    });
  }

  async onLoadData(customerId = this.customerIdS.customerId()) {
    if (!customerId) return;

    this.loading.set(true);
    const response = await this.apiResponseS.onGetItem<CobranzaOnlineInspectionResponse>(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.inspection(
        customerId,
        this.currentYear(),
        this.currentMonth(),
      ),
      false,
    );

    const typedResponse = response as CobranzaOnlineInspectionResponse | null;
    this.inspection.set(typedResponse);
    this.selectedRow.set(null);
    this.loading.set(false);
  }

  async onSelectRow(row: CobranzaOnlineInspectionRow) {
    this.selectedRow.set(row);
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    await this.dialogHandlerS.openDialog(
      CobranzaOnlineInspectionHistoryModal,
      {
        customerId,
        year: this.currentYear(),
        month: this.currentMonth(),
        row,
      },
      `Histúrico de ${row.departmentCode || row.accountNumber}`,
      this.dialogHandlerS.sizeFull,
      true,
    );
  }

  formatCurrency(value: number | null | undefined) {
    if (value === null || value === undefined) {
      return "Sin saldo";
    }

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  }

  formatDate(value: string | null | undefined) {
    if (!value) {
      return "Sin fecha";
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = parsedDate.toLocaleDateString("es-MX", { month: "short" });
    const year = parsedDate.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  navigateTo(route: string) {
    if (route) this.router.navigateByUrl(route);
  }
}
