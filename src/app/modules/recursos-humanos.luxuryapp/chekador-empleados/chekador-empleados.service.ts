import { Injectable, inject } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  IAprobarRechazarAnomaliaDTO,
  ICrearSedeChecadorDTO,
  IRegistroChecador,
  IResumenAsistencia,
  ISedeChecador,
} from "./interfaces/chekador-empleados.models";

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
    const query = new URLSearchParams();
    if (params.empleadoId) query.set("empleadoId", params.empleadoId);
    if (params.desde) query.set("desde", params.desde);
    if (params.hasta) query.set("hasta", params.hasta);
    if (params.tipo !== undefined) query.set("tipo", String(params.tipo));
    if (params.soloAnomalias !== undefined)
      query.set("soloAnomalias", String(params.soloAnomalias));

    return this._api.onGetList<IRegistroChecador[]>(
      `${Endpoints.ChekadorEmpleados.porTenantBase}${query.toString() ? `?${query.toString()}` : ""}`,
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
