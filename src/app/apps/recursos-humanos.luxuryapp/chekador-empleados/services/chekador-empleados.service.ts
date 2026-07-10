import { Injectable, inject } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  IAprobarRechazarAnomaliaDTO,
  ICrearSedeChecadorDTO,
  IRegistroChecador,
  IResumenAsistencia,
  ISedeChecador,
} from "../models/chekador-empleados.models";

@Injectable({ providedIn: "root" })
export class ChekadorEmpleadosService {
  private readonly _api = inject(ApiResponseService);

  porTenant(params: {
    empleadoId?: string;
    desde?: string;
    hasta?: string;
    tipo?: number;
    soloAnomalias?: boolean;
  }) {
    return this._api.onGetList<IRegistroChecador[]>(
      Endpoints.ChekadorEmpleados.porTenant(params),
    );
  }

  resumenHoy() {
    return this._api.onGetItem<IResumenAsistencia>(
      Endpoints.ChekadorEmpleados.resumenHoy,
    );
  }

  aprobarAnomalia(id: string, dto: IAprobarRechazarAnomaliaDTO) {
    return this._api.onPut<IRegistroChecador>(
      Endpoints.ChekadorEmpleados.aprobarAnomalia(id),
      dto,
    );
  }

  rechazarAnomalia(id: string, dto: IAprobarRechazarAnomaliaDTO) {
    return this._api.onPut<IRegistroChecador>(
      Endpoints.ChekadorEmpleados.rechazarAnomalia(id),
      dto,
    );
  }

  getSedes() {
    return this._api.onGetList<ISedeChecador[]>(
      Endpoints.ChekadorEmpleados.sedes,
    );
  }

  crearSede(dto: ICrearSedeChecadorDTO) {
    return this._api.onPost<ISedeChecador>(
      Endpoints.ChekadorEmpleados.sedes,
      dto,
    );
  }
}
