import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import {
  AppRankedList,
  RankedListItem,
} from "@ui/shared/ranked-list/ranked-list";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  DialogHandlerService,
  DialogSize,
} from "src/app/core/services/dialog-handler.service";
import { CobranzaOnlineAnalysisCondomino } from "../interfaces/cobranza-online-analysis.model";
import { CobranzaOnlineMorosidadDetailModalComponent } from "../morosidad/cobranza-online-morosidad-detail-modal";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";

/**
 * Adelantos y saldos a favor: condóminos con saldo negativo al corte.
 *
 * Lee de `analysisData.anticipos`, la misma fuente que Detalle por Condómino y
 * Morosidad. Antes leía `dashboardData.advances`, calculado aparte en el backend.
 *
 * Los importes se muestran en positivo: para el condómino un saldo de -49,252 es
 * un haber de 49,252, y presentarlo en negativo se lee como deuda.
 */
import { formatCurrency, registerLocaleData } from "@angular/common";
import localeMx from "@angular/common/locales/es-MX";

registerLocaleData(localeMx, "es-MX");

const formatMxn = (val: number) => formatCurrency(val, "es-MX", "$", "MXN");

@Component({
  selector: "app-cobranza-online-advances",
  imports: [AppRankedList, AppStatCard],
  templateUrl: "./cobranza-online-advances.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineAdvances {
  private customerIdS = inject(CustomerIdService);
  private store = inject(CobranzaOnlineStoreService);
  private dialogS = inject(DialogHandlerService);

  readonly loading = this.store.isLoading;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  private readonly analysis = this.store.analysisData;

  private readonly anticipos = computed(() => this.analysis()?.anticipos ?? []);

  private readonly byAccount = computed(() => {
    const index = new Map<string, CobranzaOnlineAnalysisCondomino>();
    for (const item of this.anticipos()) index.set(item.numeroCuenta, item);
    return index;
  });

  /** Mayor saldo a favor primero. */
  readonly items = computed<RankedListItem[]>(() =>
    [...this.anticipos()]
      .sort((a, b) => a.saldo - b.saldo)
      .map((item) => ({
        id: item.numeroCuenta,
        title: item.condomino || item.numeroCuenta,
        subtitle: item.numeroCuenta,
        amount: Math.abs(item.saldo),
      })),
  );

  /** `totalAnticipos` llega negativo desde el backend; aquí se muestra el haber. */
  readonly totalAFavor = computed(() =>
    Math.abs(this.analysis()?.totalAnticipos ?? 0),
  );

  readonly condominosConSaldo = computed(() => this.anticipos().length);

  readonly promedio = computed(() => {
    const count = this.condominosConSaldo();
    return count === 0 ? 0 : this.totalAFavor() / count;
  });

  /** Suma de saldos a favor de una subcuenta concreta, leyendo el desglose. */
  private sumaPorSubcuenta(sufijo: string): number {
    let total = 0;
    for (const condomino of this.anticipos()) {
      for (const fila of condomino.desglose ?? []) {
        if (fila.cuenta?.endsWith(sufijo) && fila.saldoFinal < 0) {
          total += Math.abs(fila.saldoFinal);
        }
      }
    }
    return total;
  }

  readonly totalMtto = computed(() => this.sumaPorSubcuenta("-001"));
  readonly totalExtraordinaria = computed(() => this.sumaPorSubcuenta("-003"));

  readonly subtituloMtto = computed(() => {
    const extraordinaria = this.totalExtraordinaria();
    return extraordinaria > 0
      ? `Extraordinaria: ${formatMxn(extraordinaria)}`
      : "Sin saldos a favor en extraordinaria";
  });

  async showDetails(selected: RankedListItem) {
    const condomino = this.byAccount().get(selected.id);
    if (!condomino) return;

    try {
      await this.dialogS.openDialog(
        CobranzaOnlineMorosidadDetailModalComponent,
        {
          row: {
            accountNumber: toLevel3(condomino.numeroCuenta),
            accountName: condomino.condomino,
            propertyFullName: condomino.condomino,
            classification: condomino.clasificacion,
          },
          customerId: this.analysis()?.customerId,
          year: this.analysis()?.year,
        },
        "Detalle de Saldo a Favor",
        DialogSize.md,
      );
    } catch (error) {
      console.error("Dialog closed", error);
    }
  }
}

/** Ver nota en cobranza-online-morosidad.ts: tres segmentos, nunca replace de "-000". */
function toLevel3(accountNumber: string): string {
  return accountNumber.split("-").slice(0, 3).join("-");
}
