import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import { CONCEPTS_CATALOG } from "../helpers/cobranza-conceptos";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";

export interface PivotRow {
  accountNumber: string;
  accountName: string;
  totalCharges: number;
  [key: string]: number | string;
}

@Component({
  selector: "app-department-charges",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppIcon,
    ButtonModule,
    TableModule,
    SharedModule,
    WebButtonLabel,
    PrimeNgCustomCaption,
    CustomInputDateSignal,
    DataViewMobile,
    MobileListItem,
  ],
  templateUrl: "./department-charges.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentCharges {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private apiResponseS = inject(ApiResponseService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();

  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly currentYear = cobranzaOnlineFilterState.year;
  readonly currentMonth = cobranzaOnlineFilterState.month;
  readonly currentDay = cobranzaOnlineFilterState.day;

  readonly currentDate = computed(() => {
    const y = this.currentYear();
    const m = this.currentMonth().toString().padStart(2, "0");
    const d = this.currentDay().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  readonly currentMonthName = computed(() => {
    const date = new Date(this.currentYear(), this.currentMonth() - 1, 1);
    return date.toLocaleDateString("es-MX", { month: "long" });
  });

  readonly dateControl = new FormControl(this.currentDate());

  readonly loading = signal(true);
  readonly pivotData = signal<PivotRow[]>([]);
  readonly concepts = CONCEPTS_CATALOG;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());

  constructor() {
    this.dateControl.valueChanges.subscribe((val) => {
      if (val) this.onDateChange(val);
    });

    effect(
      () => {
        const cId = this.customerIdS.customerId();
        if (cId) {
          this.loadData(
            cId,
            this.currentYear(),
            this.currentMonth(),
            this.currentDay(),
          );
        }
      },
      { allowSignalWrites: true },
    );
  }

  onDateChange(val: string | Date) {
    if (!val) return;

    if (val instanceof Date) {
      this.currentYear.set(val.getFullYear());
      this.currentMonth.set(val.getMonth() + 1);
      this.currentDay.set(val.getDate());
      return;
    }

    if (typeof val === "string") {
      const parts = val.split("-");
      if (parts.length === 3) {
        this.currentYear.set(parseInt(parts[0], 10));
        this.currentMonth.set(parseInt(parts[1], 10));
        this.currentDay.set(parseInt(parts[2], 10));
      }
    }
  }

  async loadData(customerId: string, year: number, month: number, day: number) {
    this.loading.set(true);
    try {
      const res =
        await this.apiResponseS.onGetItem<CobranzaOnlineDashboardResponse>(
          Endpoints.CobranzaOnline.Dashboard.get(customerId, year, month, day),
        );
      if (res?.departmentCharges?.length) {
        const sourceData = res.departmentCharges;
        const mapped = sourceData.map((dept) => {
          const row: PivotRow = {
            accountNumber: dept.accountNumber,
            accountName: dept.accountName,
            totalCharges: dept.totalCharges,
          };
          // Inicializar conceptos en 0 o vacio para no renderizar si no hay
          dept.charges.forEach((charge) => {
            const matchedConcept = this.concepts.find((c) =>
              charge.concept?.toUpperCase()?.includes(c.name),
            );
            // La cuenta cruda (rawAccount) tiene formato ej. "104-004-072-001"
            // El concepto siempre es el ÚLTIMO segmento, no el segundo.
            const rawParts = charge.rawAccount
              ? charge.rawAccount.split("-")
              : [];
            const conceptId =
              rawParts.length > 2 ? rawParts[rawParts.length - 1] : null;

            const key = conceptId
              ? `concept_${conceptId}`
              : `concept_${matchedConcept?.id}`;
            if (key) {
              // Acumular si hay mas de un cargo con la misma clasificacion
              const currentVal = (row[key] as number) || 0;
              row[key] = currentVal + charge.amount;
            }
          });
          return row;
        });
        this.pivotData.set(mapped);
      } else {
        this.pivotData.set([]);
      }
    } catch {
        this.pivotData.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
