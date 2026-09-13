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
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SelectButtonModule } from "primeng/selectbutton";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

type ClasificacionOption =
  | "TODAS"
  | "COBRANZA EXTRAJUDICIAL"
  | "MOROSOS"
  | "DEUDA CORRIENTE"
  | "SIN ADEUDO"
  | "ANTICIPOS";

@Component({
  selector: "app-cobranza-online-detalle-condominos",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SharedModule,
    LxTag,
    AppIcon,
    SelectButtonModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    MobileListItem,
  ],
  templateUrl: "./cobranza-online-detalle-condominos.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineDetalleCondominos {
  private customerIdS = inject(CustomerIdService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  private store = inject(CobranzaOnlineStoreService);

  readonly loading = this.store.isLoading;
  readonly data = this.store.analysisData;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly selectedClassification = signal<ClasificacionOption>("TODAS");

  toggleClassification(cls: ClasificacionOption) {
    if (this.selectedClassification() === cls) {
      this.selectedClassification.set("TODAS");
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

  readonly classificationOptions: ClasificacionOption[] = [
    "TODAS",
    "COBRANZA EXTRAJUDICIAL",
    "MOROSOS",
    "DEUDA CORRIENTE",
    "SIN ADEUDO",
    "ANTICIPOS",
  ];

  /** Todos los condóminos ordenados mayor→menor deuda */
  readonly allRows = computed(() => {
    const d = this.data();
    if (!d) return [];
    return [
      ...d.cobranzaJudicial,
      ...d.morosos,
      ...d.deudaCorriente,
      ...d.sinAdeudo,
      ...d.anticipos,
    ].sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo));
  });

  /** Filas filtradas por clasificación seleccionada */
  readonly filteredRows = computed(() => {
    const cls = this.selectedClassification();
    const d = this.data();
    if (!d) return [];

    let list;
    switch (cls) {
      case "COBRANZA EXTRAJUDICIAL":
        list = d.cobranzaJudicial;
        break;
      case "MOROSOS":
        list = d.morosos;
        break;
      case "DEUDA CORRIENTE":
        list = d.deudaCorriente;
        break;
      case "SIN ADEUDO":
        list = d.sinAdeudo;
        break;
      case "ANTICIPOS":
        list = d.anticipos;
        break;
      default:
        list = this.allRows();
    }
    return [...list].sort((a, b) => Math.abs(b.saldo) - Math.abs(a.saldo));
  });

  /** Totales del listado filtrado */
  readonly totales = computed(() => {
    const rows = this.filteredRows();
    return {
      total: rows.reduce((s, r) => s + (r.saldo ?? 0), 0),
      count: rows.length,
    };
  });

  /** Conteo por clasificación para los chips de resumen */
  readonly counts = computed(() => {
    const d = this.data();
    if (!d) return null;
    return {
      judicial: d.cobranzaJudicial.length,
      morosos: d.morosos.length,
      corriente: d.deudaCorriente.length,
      sinAdeudo: d.sinAdeudo.length,
      anticipos: d.anticipos.length,
    };
  });

  readonly globalFilterFields = ["numeroCuenta", "condomino", "clasificacion"];

  constructor() {}

  getSeverity(clasificacion: string) {
    switch (clasificacion) {
      case "COBRANZA EXTRAJUDICIAL":
        return "danger";
      case "MOROSOS":
        return "warn";
      case "DEUDA CORRIENTE":
        return "info";
      case "SIN ADEUDO":
        return "success";
      case "ANTICIPOS":
        return "secondary";
      default:
        return "secondary";
    }
  }

  pct(value: number, total: number) {
    if (!total) return "0%";
    return `${((value / total) * 100).toFixed(1)}%`;
  }
}
