import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CONCEPTS_CATALOG } from "../helpers/cobranza-conceptos";
import { cobranzaOnlineFilterState } from "../state/cobranza-online-filter.state";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

export interface CellMovimiento {
  cargo: number;
  abono: number;
}

export interface PivotRowMovimientos {
  accountNumber: string;
  accountName: string;
  totalCargos: number;
  totalAbonos: number;
  // key dinámica `concept_XXX` para los conceptos (donde value es CellMovimiento)
  [key: string]: number | string | CellMovimiento;
}

@Component({
  selector: "app-cobranza-online-movimientos",
  imports: [
    CommonModule,
    RouterModule,
    AppIcon,
    ButtonModule,
    TableModule,
    SharedModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    MobileListItem,
    FormsModule,
    ReactiveFormsModule,
    LxTag,
  ],
  templateUrl: "./cobranza-online-movimientos.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineMovimientos {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private store = inject(CobranzaOnlineStoreService);

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

  readonly loading = this.store.isLoading;
  readonly concepts = CONCEPTS_CATALOG;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  /** Solo mostrar columnas de conceptos que realmente tengan algún movimiento en el mes actual */
  readonly activeConcepts = computed(() => {
    const data = this.pivotData();
    if (!data.length) return [];

    return this.concepts.filter((concept) => {
      const key = `concept_${concept.id}`;
      return data.some((row) => {
        const cell = row[key] as CellMovimiento;
        return cell && (cell.cargo > 0 || cell.abono > 0);
      });
    });
  });

  constructor() {
    this.dateControl.valueChanges.subscribe((val) => {
      if (val) this.onDateChange(val);
    });
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

  readonly pivotData = computed<PivotRowMovimientos[]>(() => {
    const res = this.store.dashboardData();
    if (!res) return [];

    const charges = res?.departmentCharges ?? [];
    const payments = res?.departmentPayments ?? [];

    // Armar diccionario unificado por cuenta
    const dict: Record<string, PivotRowMovimientos> = {};

    const getOrCreateRow = (accountNumber: string, accountName: string) => {
      if (!dict[accountNumber]) {
        dict[accountNumber] = {
          accountNumber,
          accountName,
          totalCargos: 0,
          totalAbonos: 0,
        };
      }
      return dict[accountNumber];
    };

    const mapConcept = (
      rawAccount: string | undefined,
      conceptName: string | undefined,
    ) => {
      const rawParts = rawAccount ? rawAccount.split("-") : [];
      const idFromRaw =
        rawParts.length > 2 ? rawParts[rawParts.length - 1] : null;

      if (idFromRaw) return idFromRaw;

      const matched = this.concepts.find((c) =>
        conceptName?.toUpperCase()?.includes(c.name),
      );
      return matched?.id;
    };

    // Procesar cargos
    charges.forEach((dept) => {
      const row = getOrCreateRow(dept.accountNumber, dept.accountName);
      row.totalCargos += dept.totalCharges;

      dept.charges.forEach((c) => {
        const conceptId = mapConcept(c.rawAccount, c.concept);
        if (conceptId) {
          const key = `concept_${conceptId}`;
          if (!row[key]) row[key] = { cargo: 0, abono: 0 };
          (row[key] as CellMovimiento).cargo += c.amount;
        }
      });
    });

    // Procesar abonos
    payments.forEach((dept) => {
      const row = getOrCreateRow(dept.accountNumber, dept.accountName);
      row.totalAbonos += dept.totalCharges; // en el DTO de payments, totalCharges es totalAbonos

      dept.charges.forEach((c) => {
        // en el DTO de payments, charges son los abonos
        const conceptId = mapConcept(c.rawAccount, c.concept);
        if (conceptId) {
          const key = `concept_${conceptId}`;
          if (!row[key]) row[key] = { cargo: 0, abono: 0 };
          (row[key] as CellMovimiento).abono += c.amount;
        }
      });
    });

    return Object.values(dict);
  });

  getCell(row: PivotRowMovimientos, conceptId: string): CellMovimiento | null {
    const key = `concept_${conceptId}`;
    return (row[key] as CellMovimiento) || null;
  }
}
