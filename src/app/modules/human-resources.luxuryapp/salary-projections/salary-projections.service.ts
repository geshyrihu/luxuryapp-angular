import { Injectable, inject } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  ICreateSalaryProjection,
  IFederalLaborLawParameter,
  IFederalVacationParameter,
  ISalaryProjection,
  ISalaryProjectionItemSimulation,
  ISimulateSalaryProjectionRequest,
  IStateTaxParameter,
  IUpdateSalaryProjection,
  IUpdateFederalLaborLawParameter,
} from "./interfaces/salary-projections.models";

/**
 * 🧮 Servicio HTTP del módulo de proyección de sueldos.
 */
@Injectable({ providedIn: "root" })
export class SalaryProjectionsService {
  private readonly api = inject(ApiResponseService);

  getList() {
    return this.api.onGetList<ISalaryProjection[]>(Endpoints.SalaryProjections.base);
  }

  getById(id: string) {
    return this.api.onGetItem<ISalaryProjection>(Endpoints.SalaryProjections.byId(id));
  }

  create(dto: ICreateSalaryProjection) {
    return this.api.onPost<ISalaryProjection>(Endpoints.SalaryProjections.base, dto);
  }

  update(id: string, dto: IUpdateSalaryProjection) {
    return this.api.onPut<ISalaryProjection>(
      Endpoints.SalaryProjections.byId(id),
      dto,
    );
  }

  delete(id: string) {
    return this.api.onDelete(Endpoints.SalaryProjections.byId(id));
  }

  simulate(dto: ISimulateSalaryProjectionRequest) {
    return this.api.onPost<ISalaryProjectionItemSimulation[]>(
      Endpoints.SalaryProjections.simulate,
      dto,
    );
  }

  getFederalVacationParameters() {
    return this.api.onGetList<IFederalVacationParameter[]>(
      Endpoints.SalaryProjections.federalVacationParameters,
    );
  }

  createFederalVacationParameter(parameter: IFederalVacationParameter) {
    return this.api.onPost<IFederalVacationParameter>(
      Endpoints.SalaryProjections.federalVacationParameters,
      parameter,
    );
  }

  updateFederalVacationParameter(
    yearsOfService: number,
    year: number,
    vacationDays: number,
  ) {
    return this.api.onPut<IFederalVacationParameter>(
      Endpoints.SalaryProjections.federalVacationParameter(yearsOfService, year),
      { vacationDays },
    );
  }

  deleteFederalVacationParameter(yearsOfService: number, year: number) {
    return this.api.onDelete(
      Endpoints.SalaryProjections.federalVacationDelete(yearsOfService, year),
    );
  }

  getStateTaxParameters() {
    return this.api.onGetList<IStateTaxParameter[]>(
      Endpoints.SalaryProjections.stateTaxParameters,
    );
  }

  createStateTaxParameter(parameter: IStateTaxParameter) {
    return this.api.onPost<IStateTaxParameter>(
      Endpoints.SalaryProjections.stateTaxParameters,
      parameter,
    );
  }

  updateStateTaxParameter(
    state: number,
    year: number,
    employerPayrollTaxPercentage: number,
  ) {
    return this.api.onPut<IStateTaxParameter>(
      Endpoints.SalaryProjections.stateTaxParameter(state, year),
      { employerPayrollTaxPercentage },
    );
  }

  deleteStateTaxParameter(state: number, year: number) {
    return this.api.onDelete(
      Endpoints.SalaryProjections.stateTaxDelete(state, year),
    );
  }

  getFederalLaborLawParameters() {
    return this.api.onGetList<IFederalLaborLawParameter[]>(
      Endpoints.SalaryProjections.federalLaborLawParameters,
    );
  }

  updateFederalLaborLawParameter(
    year: number,
    dto: IUpdateFederalLaborLawParameter,
  ) {
    return this.api.onPut<IFederalLaborLawParameter>(
      Endpoints.SalaryProjections.federalLaborLawParameter(year),
      dto,
    );
  }

  createFederalLaborLawParameter(parameter: IFederalLaborLawParameter) {
    return this.api.onPost<IFederalLaborLawParameter>(
      Endpoints.SalaryProjections.federalLaborLawParameters,
      parameter,
    );
  }

  deleteFederalLaborLawParameter(year: number) {
    return this.api.onDelete(
      Endpoints.SalaryProjections.federalLaborLawParameter(year),
    );
  }
}
