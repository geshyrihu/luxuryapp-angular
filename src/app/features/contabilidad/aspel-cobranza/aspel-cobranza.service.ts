import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiResponse } from "src/app/core/interfaces/api-response.model";

export interface AspelCustomer {
  customerId: string;
  name: string;
}

export interface AspelAccount {
  numCta: string;
  nombre: string;
  estatus: string;
}

export interface AspelAccountsByCustomerResponse {
  customerId: string;
  totalCondominos: number;
  cuentas: AspelAccount[];
}

export interface AspelMovimiento {
  id: string;
  fecha: string;
  tipo: string;
  concepto: string;
  monto: number;
  saldo_Anterior: number;
  saldo_Posterior: number;
}

export interface AspelEstadoCuentaResponse {
  num_cta: string;
  departamento: string;
  fecha_Inicio: string;
  fecha_Fin: string;
  saldo_Inicial: number;
  saldo_Final: number;
  total_Movimientos: number;
  movimientos: AspelMovimiento[];
  saldos_finales_por_concepto: Record<string, number>[];
}

@Injectable({ providedIn: "root" })
export class AspelCobranzaService {
  private readonly baseUrl = "/api/aspel-cobranza";

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<ApiResponse<AspelCustomer[]>> {
    return this.http.get<ApiResponse<AspelCustomer[]>>(
      `${this.baseUrl}/customers`,
    );
  }

  getAccountsByCustomer(
    customerId: string,
    year: number,
  ): Observable<ApiResponse<AspelAccountsByCustomerResponse>> {
    const params = new HttpParams()
      .set("customerId", customerId)
      .set("year", year.toString());

    return this.http.get<ApiResponse<AspelAccountsByCustomerResponse>>(
      `${this.baseUrl}/accounts`,
      { params },
    );
  }

  getEstadoCuentaRango(
    customerId: string,
    numCta: string,
    fechaInicio: string,
    fechaFin: string,
  ): Observable<ApiResponse<AspelEstadoCuentaResponse>> {
    const params = new HttpParams()
      .set("customerId", customerId)
      .set("numCta", numCta)
      .set("fechaInicio", fechaInicio)
      .set("fechaFin", fechaFin);

    return this.http.get<ApiResponse<AspelEstadoCuentaResponse>>(
      `${this.baseUrl}/estado-cuenta-rango`,
      { params },
    );
  }
}
