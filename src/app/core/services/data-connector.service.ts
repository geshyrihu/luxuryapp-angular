import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable, Injector, OnDestroy, inject } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SignalRService } from "src/app/core/services/signalr.service";
import { environment } from "src/environments/environment";

const urlBase = environment.API_BASE_URL;

@Injectable({
  providedIn: "root",
})
export class DataConnectorService implements OnDestroy {
  private http = inject(HttpClient);
  private injector = inject(Injector);
  private _signalRService?: SignalRService;

  /**
   * Realiza una solicitud GET al servidor.
   * @param url La URL del recurso.
   * @param httpParams Los parametros de la solicitud HTTP (opcional).
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  get<T>(url: string, httpParams?: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<T>(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      observe: "response",
    });
  }

  /**
   * Realiza una solicitud GET al servidor para obtener un archivo (por ejemplo, una imagen o un archivo PDF).
   * @param url La URL del recurso.
   * @param httpParams Los parametros de la solicitud HTTP (opcional).
   * @returns Un observable que emite un objeto Blob representando el archivo.
   */
  getFile(url: string, httpParams?: any): Observable<Blob> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get(urlBase + url, {
      headers: httpHeaders,
      params: httpParams,
      responseType: "blob",
    });
  }

  /**
   * Realiza una solicitud GET a una URL completa para obtener un archivo (por ejemplo, una imagen o un archivo PDF).
   * @param fullUrl La URL completa del recurso.
   * @param httpParams Los parametros de la solicitud HTTP (opcional).
   * @returns Un observable que emite un objeto Blob representando el archivo.
   */
  getFileFromFullUrl(fullUrl: string, httpParams?: any): Observable<Blob> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.get<Blob>(fullUrl, {
      headers: httpHeaders,
      params: httpParams,
      responseType: "blob" as "json",
    });
  }

  /**
   * Realiza una solicitud POST al servidor.
   * @param url La URL del recurso.
   * @param data Los datos a enviar en el cuerpo de la solicitud.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  post<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.post<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  postFile(url: string, data: any): Observable<Blob> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.post(urlBase + url, data, {
      headers: httpHeaders,
      responseType: "blob",
    });
  }

  /**
   * Realiza una solicitud PUT al servidor.
   * @param url La URL del recurso.
   * @param data Los datos a enviar en el cuerpo de la solicitud.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  put<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.put<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  /**
   * Realiza una solicitud PATCH al servidor. Ideal para actualizaciones parciales.
   * @param url La URL del recurso.
   * @param data Los datos a enviar en el cuerpo de la solicitud.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  patch<T>(url: string, data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.patch<T>(urlBase + url, data, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  /**
   * Realiza una solicitud DELETE al servidor.
   * @param url La URL del recurso.
   * @returns Un observable que emite una respuesta HTTP con datos de tipo T.
   */
  delete<T>(url: string): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    return this.http.delete<T>(urlBase + url, {
      headers: httpHeaders,
      observe: "response",
    });
  }

  /**
   * Obtiene las cabeceras HTTP para la solicitud.
   * @returns Un objeto HttpHeaders con las cabeceras de la solicitud.
   */
  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    const connectionId = this.signalRService.connectionId();
    if (connectionId) {
      httpHeaders = httpHeaders.set("X-Connection-Id", connectionId);
    }

    return httpHeaders;
  }

  private get signalRService(): SignalRService {
    if (!this._signalRService) {
      this._signalRService = this.injector.get(SignalRService);
    }

    return this._signalRService;
  }

  // Utilizado para la gestion de recursos al destruir el componente
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
