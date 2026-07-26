import { inject, Injectable, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { CommitteeMorososResponseDto, CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { AspelCobranzaDetalleResponse } from "../../cobranza.luxuryapp/aspel-cobranza-haus/aspel-cobranza-haus.models";
import { firstValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommitteeCobranzaBaseService {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  loading = signal<boolean>(false);
  morososData = signal<CommitteeMorososResponseDto | null>(null);

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
