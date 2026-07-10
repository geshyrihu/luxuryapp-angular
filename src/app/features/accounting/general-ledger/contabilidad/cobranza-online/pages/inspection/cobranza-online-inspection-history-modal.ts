import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type {
  CobranzaOnlineInspectionHistoryResponse,
  CobranzaOnlineInspectionRelated401Summary,
} from "../../models/cobranza-online-inspection.model";

@Component({
  selector: "app-cobranza-online-inspection-history-modal",
  templateUrl: "./cobranza-online-inspection-history-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, TableModule, WebButtonLabel, PrimeNgCustomCaption],
})
export class CobranzaOnlineInspectionHistoryModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  readonly loading = signal(true);
  readonly history = signal<CobranzaOnlineInspectionHistoryResponse | null>(
    null,
  );

  readonly movementFilterFields = computed(() => [
    "policyType",
    "policyNumber",
    "policyConcept",
    "concept",
    "movementType",
    "related401Accounts",
  ]);

  readonly selected401Summary = computed<
    CobranzaOnlineInspectionRelated401Summary[]
  >(() => {
    const summaryMap = new Map<
      string,
      CobranzaOnlineInspectionRelated401Summary
    >();

    for (const movement of this.history()?.movements ?? []) {
      const related401Accounts = movement.related401Accounts?.trim();
      if (!related401Accounts) continue;

      const currentSummary = summaryMap.get(related401Accounts) ?? {
        related401Accounts,
        debitTotal: 0,
        creditTotal: 0,
        netTotal: 0,
        movementCount: 0,
      };

      currentSummary.debitTotal += movement.related401DebitTotal ?? 0;
      currentSummary.creditTotal += movement.related401CreditTotal ?? 0;
      currentSummary.movementCount += 1;
      currentSummary.netTotal =
        currentSummary.debitTotal - currentSummary.creditTotal;

      summaryMap.set(related401Accounts, currentSummary);
    }

    return Array.from(summaryMap.values()).sort(
      (left, right) =>
        Math.abs(right.netTotal) - Math.abs(left.netTotal) ||
        right.creditTotal - left.creditTotal ||
        left.related401Accounts.localeCompare(right.related401Accounts),
    );
  });

  readonly row = this.config.data?.row;
  readonly year = this.config.data?.year;
  readonly month = this.config.data?.month;
  readonly customerId = this.config.data?.customerId;

  ngOnInit(): void {
    void this.loadHistory();
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

  close() {
    this.ref.close();
  }

  private async loadHistory() {
    if (!this.customerId || !this.year || !this.row?.accountNumber) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    const response =
      await this.apiResponseS.onGetItem<CobranzaOnlineInspectionHistoryResponse>(
        Endpoints.AccountingCoi.CobranzaOnline.Dashboard.inspectionHistory(
          this.customerId,
          this.year,
          this.row.accountNumber,
        ),
        false,
      );

    this.history.set(
      response as CobranzaOnlineInspectionHistoryResponse | null,
    );
    this.loading.set(false);
  }
}
