import { Injectable, inject } from "@angular/core";
import type { PresupuestoContabilidadResponse } from "src/app/apps/cobranza.luxuryapp/cobranza-online/interfaces/presupuesto-contabilidad.model";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type {
  IAnalisisCobranzaOnlineDto,
  IBancosInversionesDto,
  ICedulaExtraordinariaDto,
  IEpfDTO,
  IFinancialStatementDto,
  IFlujoCajaDto,
  IFondoReservaDTO,
  IProyectosAprobadosDTO,
  IReporteFinancieroDto,
} from "../contabilidad-online/interfaces/aspel-budget.interface";

@Injectable({ providedIn: "root" })
export class ContabilidadClienteService {
  private readonly api = inject(ApiResponseService);

  getEpf(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IEpfDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.epf(
        customerId,
        year,
        mes,
      ),
    );
  }

  getEstadoResultados(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.incomeStatement(
        customerId,
        year,
        mes,
      ),
    );
  }

  getEstadoResultadosV2(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.incomeStatementV2(
        customerId,
        year,
        mes,
      ),
    );
  }

  getCedulaExtraordinaria(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<ICedulaExtraordinariaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.extraordinaryFeeSchedule(
        customerId,
        year,
        mes,
      ),
    );
  }

  getCedulaPresupuestal(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IFinancialStatementDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.budgetVsActual(
        customerId,
        year,
        mes,
      ),
    );
  }

  getReporteFinanciero(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IReporteFinancieroDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.financialReport(
        customerId,
        year,
        mes,
      ),
    );
  }

  getFlujoCaja(customerId: string, year: number) {
    return this.api.onGetItem<IFlujoCajaDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.cashFlow(
        customerId,
        year,
      ),
    );
  }

  getAnalisisCobranza(
    customerId: string,
    year: number,
    month: number,
    day: number,
  ) {
    return this.api.onGetItem<IAnalisisCobranzaOnlineDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.collectionAnalysisOnline(
        customerId,
        year,
        month,
        day,
      ),
      false,
    );
  }

  getPresupuestoContabilidad(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<PresupuestoContabilidadResponse>(
      Endpoints.ContabilidadOnline.FinancialStatements.presupuestoContabilidad(
        customerId,
        year,
        mes,
      ),
    );
  }

  getBancosInversiones(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IBancosInversionesDto>(
      Endpoints.ContabilidadOnline.FinancialStatements.bancosInversiones(
        customerId,
        year,
        mes,
      ),
    );
  }

  getFondoReserva(customerId: string, year: number, mes: number) {
    return this.api.onGetItem<IFondoReservaDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.fondoReserva(
        customerId,
        year,
        mes,
      ),
    );
  }

  getProyectosAprobados(customerId: string, year: number) {
    return this.api.onGetItem<IProyectosAprobadosDTO>(
      Endpoints.ContabilidadOnline.FinancialStatements.proyectosAprobados(
        customerId,
        year,
      ),
    );
  }
}
