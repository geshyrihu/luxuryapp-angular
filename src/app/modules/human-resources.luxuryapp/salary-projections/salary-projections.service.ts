import { Injectable, inject } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  ICreateSalaryProjection,
  IFederalVacationParameter,
  ISalaryProjection,
  ISalaryProjectionItemSimulation,
  ISimulateSalaryProjectionRequest,
  IStateTaxParameter,
  IUpdateSalaryProjection,
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

  updateFederalVacationParameter(id: string, vacationDays: number) {
    return this.api.onPut<IFederalVacationParameter>(
      Endpoints.SalaryProjections.federalVacationParameter(id),
      { vacationDays },
    );
  }

  getStateTaxParameters() {
    return this.api.onGetList<IStateTaxParameter[]>(
      Endpoints.SalaryProjections.stateTaxParameters,
    );
  }

  updateStateTaxParameter(
    id: string,
    employerPayrollTaxPercentage: number,
  ) {
    return this.api.onPut<IStateTaxParameter>(
      Endpoints.SalaryProjections.stateTaxParameter(id),
      { employerPayrollTaxPercentage },
    );
  }
}
