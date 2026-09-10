import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Injectable({
  providedIn: "root",
})
export class AspelSyncService {
  private apiResponseS = inject(ApiResponseService);

  syncCompleto(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.CobranzaSync.completo(
        customerId,
        year,
      ),
      {},
    );
  }

  syncContabilidad(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.CobranzaSync.contabilidad(
        customerId,
        year,
      ),
      {},
    );
  }

  syncCobranza(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.CobranzaSync.cobranza(
        customerId,
        year,
      ),
      {},
    );
  }
}
