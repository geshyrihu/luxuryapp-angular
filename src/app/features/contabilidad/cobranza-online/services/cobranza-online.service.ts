import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import type { CobranzaOnlineExcludedAccountUpsert } from "../models/cobranza-online-exclusions.model";


@Injectable({
  providedIn: "root",
})
export class CobranzaOnlineService {
  private apiResponseS = inject(ApiResponseService);

  syncCobranza(customerId: string, year: number) {
    return this.apiResponseS.onPost(
      Endpoints.AccountingCoi.CobranzaOnline.Sync.cobranza(customerId, year),
      {},
    );
  }

  getDashboard(customerId: string, year: number, month: number) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.get(
        customerId,
        year,
        month,
      ),
      false,
    );
  }

  getCollectionAnalysis(
    customerId: string,
    year: number,
    month: number,
    day: number,
  ) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.analysis(
        customerId,
        year,
        month,
        day,
      ),
      false,
    );
  }

  getInspection(customerId: string, year: number, month: number) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.inspection(
        customerId,
        year,
        month,
      ),
      false,
    );
  }

  getInspectionHistory(customerId: string, year: number, accountNumber: string) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.inspectionHistory(
        customerId,
        year,
        accountNumber,
      ),
      false,
    );
  }

  getSyncStatus(customerId: string, year: number) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.syncStatus(
        customerId,
        year,
      ),
      false,
    );
  }

  getExcludedAccounts(customerId: string, year: number) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.excludedAccounts(
        customerId,
        year,
      ),
      false,
    );
  }

  updateExcludedAccount(
    customerId: string,
    data: CobranzaOnlineExcludedAccountUpsert,
  ) {
    return this.apiResponseS.onPut(
      Endpoints.AccountingCoi.CobranzaOnline.Dashboard.updateExcludedAccount(
        customerId,
      ),
      data,
      true,
      false,
    );
  }

  getAccountsTree(customerId: string) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Accounts.tree(customerId),
    );
  }

  getAnnualBalances(customerId: string, year: number) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Balances.annual(customerId, year),
    );
  }

  getPortfolio(customerId: string, year: number) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Cartera.get(customerId, year),
    );
  }

  getMovements(customerId: string, year: number) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Movements.get(customerId, year),
    );
  }

  getPolicies(customerId: string, year: number) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Policies.get(customerId, year),
    );
  }

  getStatementAccounts(customerId: string) {
    return this.apiResponseS.onGetList(
      Endpoints.AccountingCoi.CobranzaOnline.Statements.cuentasNivel3(
        customerId,
      ),
    );
  }

  getStatement(customerId: string, accountId: string, year: number) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.Statements.get(
        customerId,
        accountId,
        year,
      ),
    );
  }

  getReporteFinanciero(
    customerId: string,
    year: number,
    mesInicio: number,
    mesFin: number,
  ) {
    return this.apiResponseS.onGetItem(
      Endpoints.AccountingCoi.CobranzaOnline.ReporteFinanciero.get(
        customerId,
        year,
        mesInicio,
        mesFin,
      ),
      false,
    );
  }
}
