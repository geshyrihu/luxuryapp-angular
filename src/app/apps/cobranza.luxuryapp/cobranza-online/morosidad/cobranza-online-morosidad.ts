import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { AppRankedList, RankedListItem } from "@ui/shared/ranked-list/ranked-list";
import { AppStatCard } from "@ui/shared/stat-card/stat-card";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  DialogHandlerService,
  DialogSize,
} from "src/app/core/services/dialog-handler.service";
import { CobranzaOnlineAnalysisCondomino } from "../interfaces/cobranza-online-analysis.model";
import { CobranzaOnlineStoreService } from "../state/cobranza-online-store.service";
import { CobranzaOnlineMorosidadDetailModalComponent } from "./cobranza-online-morosidad-detail-modal";

/**
 * Reporte de Morosidad: cartera vencida en dos columnas, morosos y cobranza judicial.
 *
 * Lee de `analysisData`, la misma fuente que Detalle por Condómino. Antes leía de
 * `dashboardData.topDebtors`, que clasifica por separado en otro método del backend:
 * dos cálculos del mismo hecho que ya divergieron una vez (137 morosos contra 9).
 * Con una sola fuente, las dos pantallas no pueden discrepar.
 *
 * Quien debe pero no alcanza los umbrales (DEUDA CORRIENTE) no sale aquí; se
 * consulta en Detalle por Condómino.
 */
@Component({
  selector: "app-cobranza-online-morosidad",
  imports: [AppRankedList, AppStatCard],
  templateUrl: "./cobranza-online-morosidad.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineMorosidad {
  private customerIdS = inject(CustomerIdService);
  private store = inject(CobranzaOnlineStoreService);
  private dialogS = inject(DialogHandlerService);

  readonly loading = this.store.isLoading;
  readonly hasCustomer = computed(() => !!this.customerIdS.customerId());

  private readonly analysis = this.store.analysisData;

  /** Índice para recuperar el condómino completo al abrir el detalle. */
  private readonly byAccount = computed(() => {
    const source = this.analysis();
    const index = new Map<string, CobranzaOnlineAnalysisCondomino>();
    for (const item of [
      ...(source?.morosos ?? []),
      ...(source?.cobranzaJudicial ?? []),
    ]) {
      index.set(item.numeroCuenta, item);
    }
    return index;
  });

  readonly morosos = computed(() => this.toRanked(this.analysis()?.morosos));
  readonly judicial = computed(() =>
    this.toRanked(this.analysis()?.cobranzaJudicial),
  );

  readonly totalMorosos = computed(() => this.analysis()?.totalMorosos ?? 0);
  readonly totalJudicial = computed(() => this.analysis()?.totalJudicial ?? 0);

  readonly totalCartera = computed(
    () => this.totalMorosos() + this.totalJudicial(),
  );
  readonly cuentasEnCartera = computed(
    () => this.morosos().length + this.judicial().length,
  );

  /** Ordena por saldo descendente: el ranking es la lectura útil de esta pantalla. */
  private toRanked(
    source: CobranzaOnlineAnalysisCondomino[] | undefined,
  ): RankedListItem[] {
    return [...(source ?? [])]
      .sort((a, b) => b.saldo - a.saldo)
      .map((item) => ({
        id: item.numeroCuenta,
        title: item.condomino || item.numeroCuenta,
        subtitle: item.numeroCuenta,
        amount: item.saldo,
      }));
  }

  async showDetails(selected: RankedListItem) {
    const condomino = this.byAccount().get(selected.id);
    if (!condomino) return;

    try {
      await this.dialogS.openDialog(
        CobranzaOnlineMorosidadDetailModalComponent,
        {
          // El modal espera la forma de `dashboardData.departments`: se adapta aquí
          // en lugar de duplicar el modal. Usa nivel 3 (sin el sufijo -000) porque
          // es el formato con el que se venía consultando el detalle en Aspel.
          row: {
            accountNumber: toLevel3(condomino.numeroCuenta),
            accountName: condomino.condomino,
            propertyFullName: condomino.condomino,
            classification: condomino.clasificacion,
          },
          customerId: this.analysis()?.customerId,
          year: this.analysis()?.year,
        },
        "Detalle de Morosidad",
        DialogSize.md,
      );
    } catch (error) {
      console.error("Dialog closed", error);
    }
  }
}

/**
 * "104-002-099-000" → "104-002-099". Se toman los tres primeros segmentos en vez
 * de un replace de "-000": el replace sustituiría todas las ocurrencias y
 * corrompería cuentas con más de un segmento "000".
 */
function toLevel3(accountNumber: string): string {
  return accountNumber.split("-").slice(0, 3).join("-");
}
