import { Injectable, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { saveAs } from "file-saver";
import { Subject, finalize, lastValueFrom, takeUntil } from "rxjs";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ConsoleLoggerService } from "./console-logger.service";
import { DataConnectorService } from "./data-connector.service";
import { GlobalErrorService } from "./global-error.service";
import { LoaderService } from "./loader.service";
export interface ApiResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  totalCount?: number;
}

@Injectable({
  providedIn: "root",
})
export class ApiResponseService {
  private customToastService = inject(CustomToastService);
  private consoleLogger = inject(ConsoleLoggerService);
  private globalErrorService = inject(GlobalErrorService);
  private dataConnectorS = inject(DataConnectorService);
  private loaderS = inject(LoaderService);
  private destroy$ = new Subject<void>();

  /**
   * Maneja la respuesta exitosa del API
   * @param response La respuesta del API
   * @param showSuccessToast Si se debe mostrar el toast de éxito
   * @param logEmoji Emoji para el log
   * @param logColor Color para el log
   * @param urlApi URL del endpoint para logging
   * @returns Los datos de la respuesta o null si no hay success
   */
  handleSuccess<T>(
    response: ApiResponseDTO<T>,
    showSuccessToast: boolean = true,
    logEmoji: string = "✅",
    logColor: string = "green",
    urlApi?: string,
  ): T | null {
    if (response.success) {
      if (showSuccessToast && response.message) {
        this.customToastService.showSuccess("Éxito", response.message);
      }

      if (urlApi) {
        this.consoleLogger.custom(
          logEmoji,
          logColor,
          `[API SUCCESS]: ${urlApi}`,
          response.data,
        );
      }

      return response.data;
    }

    return null;
  }

  /**
   * Maneja los errores de la respuesta del API
   * @param response La respuesta del API con errores
   * @param urlApi URL del endpoint para logging
   */
  handleError<T>(response: ApiResponseDTO<T>, urlApi?: string): void {
    const errorMessage =
      response.message || "No se pudo completar la operación.";

    // Mostrar mensaje principal
    this.customToastService.showError("Error", errorMessage);

    // Registrar error global
    this.globalErrorService.setGlobalError(errorMessage);

    // Mostrar errores adicionales si existen
    if (response.errors && response.errors.length > 0) {
      response.errors.forEach((error) => {
        this.customToastService.showError("Error", error);
      });
    }

    // Log de consola
    if (urlApi) {
      this.consoleLogger.error(`[API ERROR]: ${urlApi}`, {
        message: errorMessage,
        errors: response.errors,
      });
    }
  }

  /**
   * Procesa una respuesta del API y retorna los datos si es exitosa
   * @param response La respuesta del API
   * @param options Opciones de configuración
   * @returns Los datos si es exitosa, null si hay error
   */
  processResponse<T>(
    response: ApiResponseDTO<T>,
    options?: {
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
      logEmoji?: string;
      logColor?: string;
      urlApi?: string;
    },
  ): T | null {
    const {
      showSuccessToast = true,
      showErrorToast = true,
      logEmoji = "✅",
      logColor = "green",
      urlApi,
    } = options || {};

    if (response.success) {
      return this.handleSuccess(
        response,
        showSuccessToast,
        logEmoji,
        logColor,
        urlApi,
      );
    } else {
      if (showErrorToast) {
        this.handleError(response, urlApi);
      }
      return null;
    }
  }

  /**
   * Valida si una respuesta es exitosa
   * @param response La respuesta del API
   * @returns true si es exitosa, false en caso contrario
   */
  isSuccess<T>(response: ApiResponseDTO<T>): boolean {
    return response?.success === true;
  }

  /**
   * Obtiene los errores de una respuesta
   * @param response La respuesta del API
   * @returns Array de errores
   */
  getErrors<T>(response: ApiResponseDTO<T>): string[] {
    return response?.errors || [];
  }

  /**
   * Obtiene el mensaje de una respuesta
   * @param response La respuesta del API
   * @returns El mensaje de la respuesta
   */
  getMessage<T>(response: ApiResponseDTO<T>): string {
    return response?.message || "";
  }

  /**
   * Obtiene el total count de una respuesta paginada
   * @param response La respuesta del API
   * @returns El total count o undefined
   */
  getTotalCount<T>(response: ApiResponseDTO<T>): number | undefined {
    return response?.totalCount;
  }

  // ============================================================================
  // MÉTODOS DE PETICIONES HTTP - NUEVA ESTRUCTURA CON ApiResponseDTO
  // ============================================================================

  /**
   * Realiza una petición GET para obtener una lista
   * @param urlApi URL del endpoint
   * @param httpParams Parámetros HTTP opcionales
   * @param showLog Si se debe registrar la operación en consola
   * @returns Los datos de la lista o null si hay error
   */
  async onGetList<T>(
    urlApi: string,
    httpParams?: any,
    showLog: boolean = true,
  ): Promise<T | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .get<ApiResponseDTO<T>>(urlApi, httpParams)
          .pipe(takeUntil(this.destroy$)),
      );

      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logEmoji: "📥",
        logColor: "teal",
        urlApi: showLog ? `GET LIST: ${urlApi}` : undefined,
      });
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", errorMessage);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición GET para obtener datos paginados.
   * @param urlApi URL del endpoint
   * @param httpParams Parámetros HTTP (paginación, filtros)
   * @returns El objeto ApiResponseDTO completo o null si hay error
   */
  async onGetPaged<T>(
    urlApi: string,
    httpParams?: any,
  ): Promise<ApiResponseDTO<T> | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .get<ApiResponseDTO<T>>(urlApi, httpParams)
          .pipe(takeUntil(this.destroy$)),
      );

      if (responseData.body.success) {
        this.consoleLogger.custom(
          "📊",
          "blue",
          `[GET PAGED]: ${urlApi}`,
          responseData.body.data,
        );
        return responseData.body;
      } else {
        this.handleError(responseData.body, urlApi);
        return null;
      }
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición GET para obtener un solo elemento
   * @param urlApi URL del endpoint
   * @returns Los datos del elemento o null si hay error
   */
  async onGetItem<T>(
    urlApi: string,
    showLoader: boolean = true,
  ): Promise<T | null> {
    if (showLoader) this.loaderS.show();

    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .get<ApiResponseDTO<T>>(urlApi)
          .pipe(takeUntil(this.destroy$)),
      );

      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logEmoji: "📄",
        logColor: "dodgerblue",
        urlApi: `GET ITEM: ${urlApi}`,
      });
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición POST para crear un registro
   * @param urlApi URL del endpoint
   * @param data Datos a enviar
   * @returns Los datos creados o false si hay error
   */
  async onPost<T>(urlApi: string, data: any = null): Promise<T | false> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .post<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logEmoji: "📝",
        logColor: "green",
        urlApi: `POST: ${urlApi}`,
      });

      return result !== null ? result : false;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición POST para obtener datos paginados.
   * @param urlApi URL del endpoint
   * @param data Datos a enviar (ej. el DTO de paginación)
   * @returns El objeto ApiResponseDTO completo o null si hay error
   */
  async onPostPaged<T>(
    urlApi: string,
    data: any,
  ): Promise<ApiResponseDTO<T> | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .post<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      if (responseData.body.success) {
        this.consoleLogger.custom(
          "📊",
          "purple",
          `[POST PAGED]: ${urlApi}`,
          responseData.body.data,
        );
        return responseData.body;
      } else {
        this.handleError(responseData.body, urlApi);
        return null;
      }
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición PUT para actualizar un registro completo
   * @param urlApi URL del endpoint
   * @param data Datos a enviar
   * @param showSuccess Si se debe mostrar mensaje de éxito
   * @returns Los datos actualizados o false si hay error
   */
  async onPut<T>(
    urlApi: string,
    data: any,
    showSuccess: boolean = true,
    showLoader: boolean = true,
  ): Promise<T | false> {
    if (showLoader) this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .put<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: showSuccess,
        logEmoji: "🧩",
        logColor: "mediumslateblue",
        urlApi: `PUT: ${urlApi}`,
      });

      return result !== null ? result : false;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición PATCH para actualizar parcialmente un registro
   * @param urlApi URL del endpoint
   * @param data Datos a enviar
   * @param showSuccess Si se debe mostrar mensaje de éxito
   * @returns Los datos actualizados o false si hay error
   */
  async onPatch<T>(
    urlApi: string,
    data: any,
    showSuccess: boolean = true,
  ): Promise<T | false> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .patch<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: showSuccess,
        logEmoji: "🛠️",
        logColor: "orange",
        urlApi: `PATCH: ${urlApi}`,
      });

      return result !== null ? result : false;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Realiza una petición DELETE para eliminar un registro
   * @param urlApi URL del endpoint
   * @returns true si se eliminó correctamente, false si hay error
   */
  async onDelete(urlApi: string): Promise<boolean> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .delete<ApiResponseDTO<any>>(urlApi)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logEmoji: "🗑️",
        logColor: "crimson",
        urlApi: `DELETE: ${urlApi}`,
      });

      return result !== null;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Obtiene items para un select
   * @param urlApi URL del endpoint (se agregará prefijo 'select-items/')
   * @returns Los datos del select o null si hay error
   */
  async onGetSelectItem<T>(urlApi: string): Promise<T | null> {
    return this.onGetItem<T>(`select-items/${urlApi}`);
  }

  /**
   * Obtiene items de enum para un select
   * @param urlApi URL del endpoint (se agregará prefijo 'select-item-enum/')
   * @returns Los datos del enum select o null si hay error
   */
  async onGetEnumSelectItem<T>(urlApi: string): Promise<T | null> {
    return this.onGetItem<T>(`select-item-enum/${urlApi}`);
  }

  /**
   * Realiza una petición GET sin mostrar el loader
   * @param urlApi URL del endpoint
   * @param httpParams Parámetros HTTP opcionales
   * @returns Los datos de la lista o null si hay error
   */
  async onGetListNotLoading<T>(
    urlApi: string,
    httpParams?: any,
  ): Promise<T | null> {
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .get<ApiResponseDTO<T>>(urlApi, httpParams)
          .pipe(takeUntil(this.destroy$)),
      );

      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logEmoji: "🔍",
        logColor: "gray",
        urlApi: `GET NoLoading: ${urlApi}`,
      });
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return null;
    }
  }

  /**
   * Realiza una petición POST sin mostrar el loader
   * @param urlApi URL del endpoint
   * @param data Datos a enviar
   * @returns Los datos creados o false si hay error
   */
  async onPostNotLoading<T>(urlApi: string, data: any): Promise<T | false> {
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .post<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: false,
        logEmoji: "📝",
        logColor: "green",
        urlApi: `POST NoLoading: ${urlApi}`,
      });

      return result !== null ? result : false;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    }
  }

  /**
   * Realiza una petición POST y espera un Blob como respuesta
   * @param urlApi URL del endpoint
   * @param data Datos a enviar
   * @returns El Blob o null si hay error
   */
  async onPostBlob(urlApi: string, data: any): Promise<Blob | null> {
    try {
      const response = await lastValueFrom(
        this.dataConnectorS
          .postFile(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      return response;
    } catch (error: any) {
      // Log error
      this.consoleLogger.error("API Error (Blob)", error);

      if (
        error.error instanceof Blob &&
        error.error.type === "application/json"
      ) {
        // It's a JSON error hidden in a Blob
        try {
          const text = await error.error.text();
          const jsonError = JSON.parse(text);
          const message =
            jsonError.message || jsonError.title || "Error desconocido";
          this.globalErrorService.setGlobalError(message);
          // Also log detailed for developer
          console.error("Parsed Blob Error:", jsonError);
        } catch (e) {
          console.error("Error parsing blob error", e);
          this.globalErrorService.setGlobalError(
            "Error desconocido al procesar la imagen.",
          );
        }
      } else {
        this.globalErrorService.setGlobalError(
          "Error de conexión al generar la imagen.",
        );
      }

      return null;
    }
  }

  /**
   * Descarga un archivo
   * @param urlApi URL del endpoint
   * @param nameDocument Nombre del archivo a guardar
   */
  onDownloadFile(urlApi: string, nameDocument: string): void {
    this.loaderS.show();
    this.dataConnectorS
      .getFile(urlApi)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderS.hide()),
      )
      .subscribe({
        next: (resp: Blob) => {
          const blob = new Blob([resp], { type: resp.type });
          saveAs(blob, nameDocument);
          this.customToastService.showSuccess(
            "Completado",
            "El archivo se descargó correctamente.",
          );
          this.consoleLogger.custom(
            "📦",
            "darkgreen",
            `[Download OK]: ${urlApi}`,
          );
        },
        error: (error) => {
          const errorMessage =
            error.error?.Message || "No se pudo completar la operación.";
          this.customToastService.showError("Error", errorMessage);
          this.globalErrorService.setGlobalError(errorMessage);
          this.consoleLogger.error("API Error", error);
        },
      });
  }

  /**
   * Abre un archivo PDF en una nueva pestaña del navegador (sin descarga)
   * @param urlApi URL del endpoint que devuelve el PDF
   */
  onPreviewPdf(urlApi: string): void {
    this.loaderS.show();
    this.dataConnectorS
      .getFile(urlApi)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderS.hide()),
      )
      .subscribe({
        next: (resp: Blob) => {
          const blob = new Blob([resp], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          this.consoleLogger.custom('📄', 'darkblue', `[Preview PDF OK]: ${urlApi}`);
        },
        error: (error) => {
          const errorMessage = error.error?.Message || 'No se pudo cargar el PDF.';
          this.customToastService.showError('Error', errorMessage);
          this.globalErrorService.setGlobalError(errorMessage);
          this.consoleLogger.error('API Error', error);
        },
      });
  }

  /**
   * Descarga un archivo generado mediante una petición POST
   * @param urlApi URL del endpoint
   * @param body Cuerpo de la petición
   * @param nameDocument Nombre del archivo a guardar
   */
  onDownloadFilePost(urlApi: string, body: any, nameDocument: string): void {
    this.loaderS.show();
    this.dataConnectorS
      .postFile(urlApi, body)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loaderS.hide()),
      )
      .subscribe({
        next: (resp: Blob) => {
          const blob = new Blob([resp], { type: resp.type });
          saveAs(blob, nameDocument);
          this.customToastService.showSuccess(
            "Completado",
            "El archivo se descargó correctamente.",
          );
          this.consoleLogger.custom(
            "📦",
            "darkgreen",
            `[Download POST OK]: ${urlApi}`,
          );
        },
        error: (error) => {
          const errorMessage =
            error.error?.Message || "No se pudo completar la operación.";
          this.customToastService.showError("Error", errorMessage);
          this.globalErrorService.setGlobalError(errorMessage);
          this.consoleLogger.error("API Error", error);
        },
      });
  }

  /**
   * Exporta datos a Excel
   * @param urlApi URL del endpoint
   * @param nameDocument Nombre del archivo Excel
   */
  exportToExcel(urlApi: string, nameDocument: string): void {
    this.onDownloadFile(urlApi, nameDocument);
  }

  /**
   * Obtiene un archivo Blob desde una URL completa.
   * No utiliza ApiResponseDTO ya que devuelve directamente el Blob.
   * @param fullUrl URL completa del archivo
   * @param httpParams Parámetros HTTP opcionales
   * @returns El Blob del archivo o null si hay error
   */
  async getBlobFileFromFullUrl(
    fullUrl: string,
    httpParams?: any,
  ): Promise<Blob | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .getFileFromFullUrl(fullUrl, httpParams)
          .pipe(takeUntil(this.destroy$)),
      );
      this.consoleLogger.custom(
        "📥",
        "teal",
        `[GET BLOB FROM FULL URL OK]: ${fullUrl}`,
      );
      return responseData;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  /**
   * Valida un formulario de Angular
   * @param form FormGroup a validar
   * @returns true si es válido, false si tiene errores
   */
  validateForm(form: FormGroup): boolean {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  /**
   * Realiza una petición POST para subir un archivo.
   * @param urlApi URL del endpoint
   * @param data FormData con el archivo
   * @returns Los datos de la respuesta o false si hay error
   */
  async onPostFile<T>(urlApi: string, data: FormData): Promise<T | false> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS
          .post<ApiResponseDTO<T>>(urlApi, data)
          .pipe(takeUntil(this.destroy$)),
      );

      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logEmoji: "📤",
        logColor: "blue",
        urlApi: `POST FILE: ${urlApi}`,
      });

      return result !== null ? result : false;
    } catch (error) {
      const errorMessage =
        error.error?.Message || "No se pudo completar la operación.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error("API Error", error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
