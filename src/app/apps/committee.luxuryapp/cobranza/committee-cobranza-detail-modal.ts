import { CommonModule, CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import type { TagSeverity } from "@ui/base/tag.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { AspelCobranzaDetalleResponse } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.models";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { LxSpinner } from "src/app/shared/ui/adaptive/spinner/spinner";

/**
 * Desglose de la deuda de un condómino para el comité: criterio por el que quedó
 * clasificado y saldos vencidos que componen el adeudo, agrupados por concepto.
 *
 * Consume `committee/cobranza/morosos/{numCta}/detalle`, que en el backend reutiliza
 * el mismo servicio que el modal de Morosidad de Cobranza Online, así que ambas
 * pantallas muestran idéntico desglose.
 */
@Component({
  selector: "app-committee-cobranza-detail-modal",
  templateUrl: "./committee-cobranza-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CurrencyPipe, LxTag, AppIcon, LxSpinner],
})
export class CommitteeCobranzaDetailModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);

  readonly loading = signal(true);
  readonly detail = signal<AspelCobranzaDetalleResponse | null>(null);

  readonly row = this.config.data?.row as CommitteeMorosoItemDto | undefined;
  readonly customerId = this.config.data?.customerId as string | undefined;

  ngOnInit(): void {
    void this.loadDetail();
  }

  /** Encabezado del criterio, según la clasificación del condómino. */
  get ruleTitle(): string {
    switch (this.row?.clasificacion) {
      case "COBRANZA JUDICIAL":
        return "Criterio de Cobranza Judicial";
      case "MOROSOS":
        return "Criterio de Morosidad";
      case "DEUDA CORRIENTE":
        return "Criterio de Deuda Corriente";
      default:
        return "Criterio de Clasificación";
    }
  }

  /** Regla vigente. Ver docs/aspel/ASPEL_API_GUIDE.md. */
  get ruleDescription(): string {
    switch (this.row?.clasificacion) {
      case "COBRANZA JUDICIAL":
        return "El adeudo del condómino equivale a más de 5 cuotas de mantenimiento, o a 5 o más cuotas extraordinarias.";
      case "MOROSOS":
        return "El adeudo del condómino equivale a 2 o más cuotas de mantenimiento, o a 1 o más cuotas extraordinarias.";
      case "DEUDA CORRIENTE":
        return "El condómino debe, pero su adeudo no llega a 2 cuotas de mantenimiento ni a 1 extraordinaria. Normalmente es la cuota del mes en curso.";
      default:
        return "El condómino está al corriente o tiene saldo a favor.";
    }
  }

  getConceptSeverity(concepto: string): TagSeverity {
    const normalized = concepto.toUpperCase();
    if (normalized.includes("MTTO") || normalized.includes("MANTENIMIENTO"))
      return "info";
    if (normalized.includes("EXTRA")) return "warn";
    if (normalized.includes("RESERVA")) return "success";
    if (normalized.includes("PENA") || normalized.includes("MORATORIO"))
      return "danger";
    return "secondary";
  }

  getBalanceClass(balance: number | undefined | null): string {
    if (!balance) return "text-color";
    if (balance > 0) return "text-orange-600";
    if (balance < 0) return "text-green-600";
    return "text-color";
  }

  private async loadDetail() {
    if (!this.customerId || !this.row?.numCtaBase) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    try {
      const response =
        await this.apiResponseS.onGetItem<AspelCobranzaDetalleResponse>(
          Endpoints.Committee.Cobranza.morosoDetalle(
            this.customerId,
            this.row.numCtaBase,
          ),
        );
      this.detail.set(response ?? null);
    } catch (error) {
      console.error("Error cargando el desglose de deuda", error);
    } finally {
      this.loading.set(false);
    }
  }
}
