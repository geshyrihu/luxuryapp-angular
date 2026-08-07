import { computed, inject, Injectable, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { CommitteeMorososResponseDto } from "../interfaces/committee-cobranza.dto";

@Injectable({
  providedIn: "root",
})
export class CommitteeCobranzaBaseService {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  loading = signal<boolean>(false);
  morososData = signal<CommitteeMorososResponseDto | null>(null);

  /**
   * Avance de la cobranza del mes. Vive aquí para que web y móvil muestren
   * exactamente lo mismo sin duplicar el cálculo.
   */
  readonly avanceCobranza = computed(() => {
    const d = this.morososData();
    if (!d) return null;

    const meta = d.cobranzaPerfecta || 0;
    const cobrado = d.cobradoDelMes || 0;

    return {
      meta,
      cobrado,
      faltante: meta - cobrado,
      porcentaje: meta > 0 ? cobrado / meta : 0,
    };
  });

  /** Cartera vencida: cuántos deben y cuánto, sobre el total de condóminos. */
  readonly carteraVencida = computed(() => {
    const d = this.morososData();
    if (!d) return null;

    return {
      total: d.totalDeudaPendiente,
      condominosConAdeudo: d.totalMorosos,
      totalCondominos: d.totalDepartamentos,
    };
  });

  /** Cobranza judicial: el dato que un comité necesita accionar. */
  readonly cobranzaJudicial = computed(() => {
    const d = this.morososData();
    if (!d) return null;

    return { cantidad: d.cantidadJudicial, deuda: d.deudaJudicial };
  });

  async loadMorosos() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    this.loading.set(true);
    try {
      const response = await this.apiResponseS.onGetItem<CommitteeMorososResponseDto>(
        Endpoints.Committee.Cobranza.morosos(customerId)
      );
      if (response && response.propiedades) {
        response.propiedades = response.propiedades.filter(p => p.saldoPendiente > 0.01);
        response.propiedades.sort((a, b) => b.saldoPendiente - a.saldoPendiente);
        response.totalMorosos = response.propiedades.length;
      }
      this.morososData.set(response);
    } finally {
      this.loading.set(false);
    }
  }

}
