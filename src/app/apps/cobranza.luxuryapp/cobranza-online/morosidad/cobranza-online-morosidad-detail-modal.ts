import { CommonModule, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { SharedModule } from "@ui/web/primeng-api/primeng-api";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { EndpointsCobranza } from "src/app/core/constants/endpoints/cobranza.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { LxSpinner } from "src/app/shared/ui/adaptive/spinner/spinner";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { AspelCobranzaDetalleResponse } from "../../aspel-cobranza-haus/aspel-cobranza-haus.models";
import { CobranzaOnlineDashboardDepartment } from "../interfaces/cobranza-online-dashboard.model";

@Component({
  selector: "app-cobranza-online-morosidad-detail-modal",

  imports: [CommonModule, SharedModule, LxTag, NgClass, LxSpinner, AppIcon],
  templateUrl: "./cobranza-online-morosidad-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineMorosidadDetailModalComponent implements OnInit {
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  readonly data = this.config.data?.row as CobranzaOnlineDashboardDepartment;

  readonly isLoading = signal(true);
  readonly detail = signal<AspelCobranzaDetalleResponse | null>(null);

  ngOnInit() {
    this.loadDetail();
  }

  async loadDetail() {
    try {
      this.isLoading.set(true);
      const { customerId } = this.config.data || {};
      const numCta = this.data.accountNumber;

      if (!customerId || !numCta) {
        throw new Error(
          "Faltan parámetros para consultar el detalle de cobranza",
        );
      }

      const res =
        await this.apiResponseS.onGetItem<AspelCobranzaDetalleResponse>(
          EndpointsCobranza.AspelCobranza.detalleCobranzaRango(
            customerId,
            numCta,
          ),
        );
      this.detail.set(res || null);
    } catch (e) {
      console.error("Error cargando detalle de cobranza", e);
    } finally {
      this.isLoading.set(false);
    }
  }

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
    const normalized = concepto.toUpperCase();
    if (normalized.includes("MTTO") || normalized.includes("MANTENIMIENTO"))
      return "info";
    if (normalized.includes("EXTRA")) return "warn";
    if (normalized.includes("RESERVA")) return "success";
    if (normalized.includes("TARJETA")) return "contrast";
    if (normalized.includes("PENA") || normalized.includes("MORATORIO"))
      return "danger";
    return "secondary";
  }

  getBalanceClass(amount: number | undefined | null) {
    if (!amount) return "text-color";
    if (amount > 0) return "text-orange-600";
    if (amount < 0) return "text-green-600";
    return "text-color";
  }

  // Criterios de clasificación (Reglas de Negocio extraídas del Backend)
  get ruleTitle() {
    switch (this.data.classification) {
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

  get ruleDescription() {
    switch (this.data.classification) {
      case "COBRANZA JUDICIAL":
        return "El adeudo del condómino equivale a más de 5 cuotas de mantenimiento, o a 5 o más cuotas extraordinarias.";
      case "MOROSOS":
        return "El adeudo del condómino equivale a 2 o más cuotas de mantenimiento, o a 1 o más cuotas extraordinarias.";
      case "DEUDA CORRIENTE":
        return "El condómino debe, pero su adeudo no llega a 2 cuotas de mantenimiento ni a 1 extraordinaria. Normalmente es la cuota del mes en curso.";
      default:
        return "El condómino está al corriente (Sin Adeudo) o tiene saldo a favor (Anticipos).";
    }
  }
}
