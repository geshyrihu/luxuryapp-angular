import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "@ui/web/primeng-button/primeng-button";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { SharedModule } from "primeng/api";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { CobranzaOnlineService } from "../cobranza-online.service";

interface ChargeItem {
  concept: string;
  amount: number;
  rawAccount: string;
}

interface DepartmentChargesData {
  accountNumber: string;
  accountName: string;
  charges: ChargeItem[];
  totalCharges: number;
}

export const CONCEPTS_CATALOG = [
  { id: "001", name: "CUOTA DE MTTO", label: "MTTO" },
  { id: "002", name: "DESCUENTO POR PRONTO PAGO", label: "DESC. PRONTO PAGO" },
  { id: "003", name: "CUOTA EXTRAORDINARIA", label: "EXTRAORDINARIA" },
  { id: "004", name: "INTERESES MORATORIOS", label: "INT. MORATORIOS" },
  { id: "005", name: "PENA MORATORIA", label: "PENA MORATORIA" },
  {
    id: "006",
    name: "CUOTA EXTRA NORMAS DE CONVIVENCIA",
    label: "NORMAS CONV.",
  },
  { id: "007", name: "MULTAS", label: "MULTAS" },
  { id: "008", name: "USO DE SALON", label: "SALÓN" },
  { id: "009", name: "USO DE SALON ROOM", label: "SALÓN ROOM" },
  { id: "010", name: "USO DE SALON SOCIAL", label: "SALÓN SOCIAL" },
  { id: "011", name: "USO DE JARDIN", label: "JARDÍN" },
  { id: "012", name: "USO DE MEZZANINE", label: "MEZZANINE" },
  { id: "013", name: "USO DE TERRAZA", label: "TERRAZA" },
  { id: "014", name: "USO DE ASADORES", label: "ASADORES" },
  { id: "015", name: "CUOTA RESTAURANTE", label: "RESTAURANTE" },
  { id: "016", name: "CLASES DE PILATES", label: "PILATES" },
  { id: "017", name: "SNACK BAR", label: "SNACK BAR" },
  { id: "018", name: "TARJETAS DE ACCESO", label: "TARJETAS" },
  { id: "019", name: "TAG", label: "TAG" },
  { id: "020", name: "FONDO DE RESERVA", label: "FONDO RESERVA" },
  { id: "021", name: "RECUPERACION CONSUMO DE AGUA", label: "REC. AGUA" },
  {
    id: "022",
    name: "RECUPERACION CONSUMO ENERGIA ELECTRICA",
    label: "REC. LUZ",
  },
  { id: "023", name: "CONSUMO DE AGUA", label: "AGUA" },
  { id: "024", name: "CONSUMO ENERGIA ELECTRICA", label: "LUZ" },
  { id: "025", name: "DEPOSITO EN GARANTIA", label: "DEPÓSITO GARANTÍA" },
  { id: "026", name: "CINE", label: "CINE" },
];

export interface PivotRow {
  accountNumber: string;
  accountName: string;
  totalCharges: number;
  [key: string]: number | string;
}

@Component({
  selector: "app-department-payments",
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
  ],
  templateUrl: "./department-payments.html",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DepartmentPayments {
  private router = inject(Router);
  private customerIdS = inject(CustomerIdService);
  private cobranzaOnlineS = inject(CobranzaOnlineService);
  private tableScrollHeightS = inject(TableScrollHeightService);

  readonly tablePrimeNgRows = tablePrimeNgRows();
  readonly rowsPerPageOptions = rowsPerPageOptions();

  readonly scrollHeight = this.tableScrollHeightS.scrollHeight;
  readonly currentYear = signal(new Date().getFullYear());
  readonly currentMonth = signal(new Date().getMonth() + 1);
  readonly currentDay = signal(new Date().getDate());

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

  readonly loading = signal(true);
  readonly pivotData = signal<PivotRow[]>([]);
  readonly concepts = CONCEPTS_CATALOG;

  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());
  readonly customerName = computed(() => this.customerIdS.customerName());

  constructor() {
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

    if (typeof val === 'string') {
      const parts = val.split("-");
      if (parts.length >= 3) {
        this.currentYear.set(parseInt(parts[0], 10));
        this.currentMonth.set(parseInt(parts[1], 10));
        this.currentDay.set(parseInt(parts[2], 10));
      }
    }
  }

  async loadData(customerId: string, year: number, month: number, day: number) {
    this.loading.set(true);
    try {
      const res = await this.cobranzaOnlineS.getDashboard(
        customerId,
        year,
        month,
        day,
      );
      if (res && (res as any).departmentPayments) {
        const sourceData = (res as any)
          .departmentPayments as DepartmentChargesData[];
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
            // El concepto siempre es el sLTIMO segmento, no el segundo.
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
    } catch (e) {
      console.error(e);
      this.pivotData.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
