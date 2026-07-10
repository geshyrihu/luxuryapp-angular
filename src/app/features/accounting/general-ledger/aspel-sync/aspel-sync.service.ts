import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Injectable({
  providedIn: "root",
})
export class AspelSyncService {
  private apiResponseS = inject(ApiResponseService);

  syncCompleto(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.AccountingCoi.Configuration.AspelSync.completo(
        customerId,
        year,
      ),
      {},
    );
  }

  syncContabilidad(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.AccountingCoi.Configuration.AspelSync.contabilidad(
        customerId,
        year,
      ),
      {},
    );
  }

  syncCobranza(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.AccountingCoi.Configuration.AspelSync.cobranza(
        customerId,
        year,
      ),
      {},
    );
  }
}
