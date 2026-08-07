import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTag } from "@ui/adaptive/tag/tag";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { ButtonModule } from "primeng/button";
import { SelectButtonModule } from "primeng/selectbutton";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import {
  DialogHandlerService,
  DialogSize,
} from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { WebButtonIcon } from "../../../../shared/ui/buttons";
import { CobranzaOnlineDashboardDepartment } from "../interfaces/cobranza-online-dashboard.model";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";
import { CobranzaOnlineMorosidadDetailModalComponent } from "./cobranza-online-morosidad-detail-modal";

// El reporte de morosidad cubre solo cartera morosa: quien tiene saldo pero aún no
// alcanza las cuotas vencidas de moroso (DEUDA CORRIENTE) se consulta en Detalle Condóminos.
type ClasificacionOption = "TODAS LAS DEUDAS" | "COBRANZA JUDICIAL" | "MOROSOS";

@Component({
  selector: "app-cobranza-online-morosidad",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SharedModule,
    LxTag,
    SelectButtonModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    ButtonModule,
    WebButtonIcon,
  ],
  templateUrl: "./cobranza-online-morosidad.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineMorosidad {
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private store = inject(CobranzaOnlineStoreService);
  private dialogS = inject(DialogHandlerService);

  readonly loading = this.store.isLoading;
  readonly data = this.store.dashboardData;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly selectedClassification =
    signal<ClasificacionOption>("TODAS LAS DEUDAS");

  toggleClassification(cls: ClasificacionOption) {
    if (this.selectedClassification() === cls) {
      this.selectedClassification.set("TODAS LAS DEUDAS");
    } else {
      this.selectedClassification.set(cls);
    }
  }

  isActive(cls: ClasificacionOption): boolean {
    return this.selectedClassification() === cls;
  }

  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();
  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly globalFilterFields = [
    "propertyFullName",
    "accountNumber",
    "accountName",
  ];

  readonly classificationOptions: ClasificacionOption[] = [
    "TODAS LAS DEUDAS",
    "COBRANZA JUDICIAL",
    "MOROSOS",
  ];

  /** Conteo por clasificación para los chips de resumen */
  readonly counts = computed(() => {
    const list = this.allDebtors();
    return {
      judicial: list.filter((r) => r.classification === "COBRANZA JUDICIAL")
        .length,
      morosos: list.filter((r) => r.classification === "MOROSOS").length,
    };
  });

  /** Cartera morosa: solo morosos y cobranza judicial, ordenados mayor→menor deuda */
  readonly allDebtors = computed(() => {
    const d = this.data();
    if (!d || !d.topDebtors) return [];
    return d.topDebtors
      .filter(
        (dept) =>
          dept.classification === "MOROSOS" ||
          dept.classification === "COBRANZA JUDICIAL",
      )
      .sort((a, b) => b.balance - a.balance);
  });

  /** Filas filtradas por clasificación seleccionada */
  readonly filteredRows = computed(() => {
    const cls = this.selectedClassification();
    const list = this.allDebtors();

    if (cls === "TODAS LAS DEUDAS") return list;
    return list.filter((r) => r.classification === cls);
  });

  /** Totales dinámicos de las filas mostradas */
  readonly totales = computed(() => {
    const list = this.filteredRows();
    let maintenance = 0;
    let extraordinary = 0;
    let fines = 0;
    let balance = 0;

    for (const item of list) {
      maintenance += item.maintenanceBalance || 0;
      extraordinary += item.extraordinaryBalance || 0;
      fines += item.finesBalance || 0;
      balance += item.balance || 0;
    }

    return { maintenance, extraordinary, fines, balance, count: list.length };
  });

  async showDetails(row: CobranzaOnlineDashboardDepartment) {
    try {
      const dashboard = this.store.dashboardData();
      const customerId = dashboard?.customerId;
      const year = dashboard?.year;
      
      const allCharges = dashboard?.departmentCharges || [];
      const deptCharges = allCharges.find((c) => c.accountNumber === row.accountNumber);
      const detailedCharges = deptCharges?.charges || [];

      await this.dialogS.openDialog(
        CobranzaOnlineMorosidadDetailModalComponent,
        { row, customerId, year, detailedCharges },
        "Detalle de Morosidad",
        DialogSize.md,
      );
    } catch (error) {
      console.error("Dialog closed", error);
    }
  }
}
