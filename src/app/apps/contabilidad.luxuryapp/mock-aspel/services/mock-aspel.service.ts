import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";

export interface MovimientosQueryRequest {
  ejercicio: number;
  fechaInicio?: string;
  fechaFin?: string;
  numCtaIniciaCon?: string;
  periodo?: number;
  tipoPoliza?: string;
  tipoEmpresa?: string;
  nivel?: number;
  numCtaPapa?: string;
  page?: number;
  pageSize?: number;
}

export interface MovimientoResponse {
  id: string;
  tipoPoli: string;
  numPoliz: string;
  numPart: number;
  numCta: string;
  debeHaber: string;
  montoMov: number;
  periodo: number;
  ejercicio: number;
  fechaPol: string;
  concepPo: string;
  nivel: number;
  tipoCuenta: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SaldoResponse {
  id: string;
  numCta: string;
  nombre: string;
  nivel: number;
  naturaleza: number;
  ejercicio: number;
  inicial: number;
  inicialEx: number;
  cargoMes: number;
  abonoMes: number;
  realMes: number;
  presupuestoMes: number;
  variacion: number;
  porcentajeEjecucion: number;
  [key: string]: string | number;
}

export interface SaldoQueryRequest {
  ejercicio: number;
  numCta?: string;
  periodo?: number;
  nivel?: number;
  numCtaPapa?: string;
  page?: number;
  pageSize?: number;
}

export interface MovimientoFilterOption<T> {
  value: T;
  label: string;
}

export interface MovimientoFilterOptionsResponse {
  niveles: MovimientoFilterOption<number>[];
  cuentasPadre: MovimientoFilterOption<string>[];
}

export interface PartidaCreateRequest {
  numPart: number;
  numCta: string;
  debeHaber: "D" | "H";
  montoMov: number;
  tipCambio?: number;
  numDepto?: number;
  uuidFiscal?: string;
}

export interface PolizaCreateRequest {
  tipoPoli: string;
  numPoliz: string;
  ejercicio: number;
  periodo: number;
  fechaPol: string;
  concepPo: string;
  partidas: PartidaCreateRequest[];
}

export interface MockCuentaResponse {
  numCta: string;
  nombre: string;
  capturaUuid: number;
  deptsino: string;
}

export interface EstadoDeCuentaMovimientoResponse {
  tipoPoli: string;
  numPoliz: string;
  numPart: number;
  fechaPol: string;
  conceptoPoliza: string;
  debeHaber: string;
  montoMov: number;
}

export interface EstadoDeCuentaResponse {
  cuenta: MockCuentaResponse;
  saldoInicial: number;
  movimientos: EstadoDeCuentaMovimientoResponse[];
}

export interface MockAspelSyncCustomer {
  customerId: string;
  customerName: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface AspelCustomerEmpresaSelectItem {
  label: string;
  value: string;
}

export interface MockAspelSyncResult {
  customerId: string;
  customerName: string;
  intEmpresa: number;
  ejercicio: number;
  ultimoPeriodoConMovimientos: number;
  cuentas: number;
  polizas: number;
  auxiliares: number;
  saldos: number;
  presupuestos: number;
}

@Injectable({ providedIn: "root" })
export class MockAspelService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = "/api/AspelCOI";

  getMovimientos(query: MovimientosQueryRequest): Observable<PagedResponse<MovimientoResponse>> {
    return this.http.get<PagedResponse<MovimientoResponse>>(
      `${this.baseUrl}/Query/Movimientos`,
      { params: this.toParams(query) },
    );
  }

  getSaldos(query: SaldoQueryRequest): Observable<PagedResponse<SaldoResponse>> {
    return this.http.get<PagedResponse<SaldoResponse>>(
      `${this.baseUrl}/Query/Saldos`,
      { params: this.toParams(query) },
    );
  }

  getMovimientoFilterOptions(query: Pick<MovimientosQueryRequest, "ejercicio" | "periodo" | "nivel">): Observable<MovimientoFilterOptionsResponse> {
    return this.http.get<MovimientoFilterOptionsResponse>(
      `${this.baseUrl}/Query/FilterOptions`,
      { params: this.toParams(query) },
    );
  }

  getCuentas(): Observable<MockCuentaResponse[]> {
    return this.http.get<MockCuentaResponse[]>(`${this.baseUrl}/Cuentas`);
  }

  getEstadoDeCuenta(numCta: string, query: Pick<MovimientosQueryRequest, "ejercicio" | "fechaInicio" | "fechaFin">): Observable<EstadoDeCuentaResponse> {
    return this.http.get<EstadoDeCuentaResponse>(`${this.baseUrl}/Query/EstadoDeCuenta/${encodeURIComponent(numCta)}`, { params: this.toParams(query) });
  }

  createPoliza(poliza: PolizaCreateRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/Polizas`, poliza);
  }

  getSyncCustomers(): Observable<MockAspelSyncCustomer[]> {
    return this.http
      .get<ApiResponse<AspelCustomerEmpresaSelectItem[]>>(
        `${environment.API_BASE_URL}select-items/aspel-customer-empresa`,
      )
      .pipe(
        map((response) => response.success
          ? response.data
            .map((item) => ({ customerId: item.value, customerName: item.label }))
          : []),
      );
  }

  syncRealData(customerId: string, ejercicio: number): Observable<MockAspelSyncResult> {
    return this.http.post<MockAspelSyncResult>(`${this.baseUrl}/Admin/SyncRealData`, { customerId, ejercicio });
  }

  private toParams(query: object): HttpParams {
    return Object.entries(query).reduce((params, [key, value]) => {
      if (value === undefined || value === null || value === "") return params;
      return params.set(key, String(value));
    }, new HttpParams());
  }
}
