import { inject, Injectable } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspelBudgetDTO } from "../models/presupuesto-shared.models";
import { BudgetAccountRuleDataDTO } from "../presupuesto-web-aspel/presupuestos.interfaces";

@Injectable({
  providedIn: "root",
})
export class PresupuestoSharedService {
  private apiResponseS = inject(ApiResponseService);
  private readonly baseUrl = "presupuesto";

  getAspelQuotation(
    customerId: string,
    intYear: number,
  ): Promise<AspelBudgetDTO> {
    const url = `${this.baseUrl}/aspel?customerId=${customerId}&intYear=${intYear}`;
    return this.apiResponseS.onGetList(url);
  }

  getAspelFullQuotation(
    customerId: string,
    intYear: number,
  ): Promise<AspelBudgetDTO> {
    const url = `${this.baseUrl}/aspel-full?customerId=${customerId}&intYear=${intYear}`;
    return this.apiResponseS.onGetList(url);
  }

  getAspelSummary(
    customerId: string,
    intYear: number,
  ): Promise<AspelBudgetDTO> {
    const url = `${this.baseUrl}/aspel-summary?customerId=${customerId}&intYear=${intYear}`;
    return this.apiResponseS.onGetList(url);
  }

  getPresupuestoLimpioEjercicioFiscal(
    customerId: string,
    intYear: number,
  ): Promise<AspelBudgetDTO> {
    const url = `${this.baseUrl}/presupuesto-limpio-ejercicio-fiscal?customerId=${customerId}&intYear=${intYear}`;
    return this.apiResponseS.onGetList(url);
  }
  getPresupuestoLimpioCobranza(
    customerId: string,
    intYear: number,
  ): Promise<AspelBudgetDTO> {
    const url = `${this.baseUrl}/presupuesto-limpio-cobranza?customerId=${customerId}&intYear=${intYear}`;
    return this.apiResponseS.onGetList(url);
  }

  getBudgetAccountRules(
    customerId: string,
  ): Promise<BudgetAccountRuleDataDTO[]> {
    return this.apiResponseS.onGetList(`BudgetAccountRules/${customerId}`);
  }
}
