import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import type { CobranzaOnlineDashboardResponse } from "./interfaces/cobranza-online-dashboard.model";
import type { CobranzaOnlineAnalysisResponse } from "./interfaces/cobranza-online-analysis.model";
import type {
  CobranzaOnlineInspectionResponse,
  CobranzaOnlineInspectionHistoryResponse,
} from "./interfaces/cobranza-online-inspection.model";
import type { CobranzaOnlineSyncMetadata, CobranzaOnlineSyncResponse } from "./interfaces/cobranza-online-sync.model";
import type {
  CobranzaOnlineExcludedAccountListResponse,
  CobranzaOnlineExcludedAccountRow,
} from "./interfaces/cobranza-online-exclusions.model";
import type { CobranzaOnlineStatementResponse } from "./interfaces/cobranza-online-dashboard.model";
import type { ReporteFinancieroResponse } from "./interfaces/cobranza-online-reporte-financiero.model";

@Injectable({
  providedIn: "root",
})
export class CobranzaOnlineService {
  private apiS = inject(ApiResponseService);

  async getDashboard(
    customerId: string,
    year: number,
    month: number,
    day?: number,
  ): Promise<CobranzaOnlineDashboardResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineDashboardResponse>(
      Endpoints.CobranzaOnline.Dashboard.get(customerId, year, month, day),
    );
  }

  async getAnalysis(
    customerId: string,
    year: number,
    month: number,
    day: number,
  ): Promise<CobranzaOnlineAnalysisResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineAnalysisResponse>(
      Endpoints.CobranzaOnline.Dashboard.analysis(customerId, year, month, day),
    );
  }

  async getInspection(
    customerId: string,
    year: number,
    month: number,
  ): Promise<CobranzaOnlineInspectionResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineInspectionResponse>(
      Endpoints.CobranzaOnline.Dashboard.inspection(customerId, year, month),
    );
  }

  async getInspectionHistory(
    customerId: string,
    year: number,
    accountNumber: string,
  ): Promise<CobranzaOnlineInspectionHistoryResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineInspectionHistoryResponse>(
      Endpoints.CobranzaOnline.Dashboard.inspectionHistory(
        customerId,
        year,
        accountNumber,
      ),
    );
  }

  async getSyncStatus(
    customerId: string,
    year: number,
  ): Promise<CobranzaOnlineSyncMetadata | null> {
    return this.apiS.onGetItem<CobranzaOnlineSyncMetadata>(
      Endpoints.CobranzaOnline.Dashboard.syncStatus(customerId, year),
    );
  }

  async getExcludedAccounts(
    customerId: string,
    year: number,
  ): Promise<CobranzaOnlineExcludedAccountListResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineExcludedAccountListResponse>(
      Endpoints.CobranzaOnline.Dashboard.excludedAccounts(customerId, year),
    );
  }

  async updateExcludedAccount(
    customerId: string,
    data: Partial<CobranzaOnlineExcludedAccountRow>,
  ): Promise<CobranzaOnlineExcludedAccountRow | null> {
    const result = await this.apiS.onPut<CobranzaOnlineExcludedAccountRow>(
      Endpoints.CobranzaOnline.Dashboard.updateExcludedAccount(customerId),
      data,
    );
    return result === false ? null : result;
  }

  async syncCobranza(
    customerId: string,
    year: number,
  ): Promise<CobranzaOnlineSyncResponse | null> {
    const result = await this.apiS.onPost<CobranzaOnlineSyncResponse>(
      Endpoints.CobranzaOnline.Sync.cobranza(customerId, year),
    );
    return result === false ? null : result;
  }

  async getStatement(
    customerId: string,
    accountId: string,
    year: number,
  ): Promise<CobranzaOnlineStatementResponse | null> {
    return this.apiS.onGetItem<CobranzaOnlineStatementResponse>(
      Endpoints.CobranzaOnline.Statements.get(customerId, accountId, year),
    );
  }

  async getReporteFinanciero(
    customerId: string,
    year: number,
    mesInicio: number,
    mesFin: number,
  ): Promise<ReporteFinancieroResponse | null> {
    return this.apiS.onGetItem<ReporteFinancieroResponse>(
      Endpoints.CobranzaOnline.ReporteFinanciero.get(
        customerId,
        year,
        mesInicio,
        mesFin,
      ),
    );
  }
}
