import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { environment } from "src/environments/environment";
import { AspelResumenDto, EstadoCuentaDto, PresupuestoGastosDto, ReporteFinancieroDto } from "./firebis-dtos";

export enum DatabaseType {
  Cobranza = 1,
  Contabilidad = 2,
}

@Injectable({
  providedIn: "root",
})
export class FirebisDataService {
  private apiResponseS = inject(ApiResponseService);

  // Custom API URL directly used since our BaseApiUrl might not be Localhost Firebird
  private apiUrl = environment.API_FIREBIRD_URL + "AspelData";

  async getEstadisticas(
    database: DatabaseType,
    ejercicio?: number,
  ): Promise<AspelResumenDto[]> {
    let url = `${this.apiUrl}/estadisticas?database=${database}`;
    if (ejercicio) {
      url += `&ejercicio=${ejercicio}`;
    }
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error fetching Estadisticas");

    const data = await resp.json();
    console.log("Estadisticas:", data);
    return data;
  }

  async getGastosOperacion(
    database: DatabaseType,
    ejercicio: number,
    tipo: string,
  ): Promise<PresupuestoGastosDto[]> {
    const url = `${this.apiUrl}/gastos-operacion?database=${database}&ejercicio=${ejercicio}&tipo=${tipo}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error fetching Gastos de Operacion");
    
    const data = await resp.json();
    console.log("Gastos:", data);
    return data;
  }

  async getReporteFinanciero(
    database: DatabaseType,
    ejercicio: number,
  ): Promise<ReporteFinancieroDto[]> {
    const url = `${this.apiUrl}/reporte-financiero?database=${database}&ejercicio=${ejercicio}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error fetching Reporte Financiero");
    
    const data = await resp.json();
    console.log("Reporte Financiero:", data);
    return data;
  }
  async getEstadoCuenta(
    database: DatabaseType,
    ejercicio: number,
  ): Promise<EstadoCuentaDto[]> {
    const url = `${this.apiUrl}/estado-cuenta?database=${database}&ejercicio=${ejercicio}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error fetching Estado de Cuenta");
    
    const data = await resp.json();
    console.log("Estado Cuenta:", data.length, "rows");
    return data;
  }
}









