import { Injectable, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { saveAs } from "file-saver";
import { lastValueFrom } from "rxjs";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DataConnectorService } from "../../services/data-connector.service";
import { LoaderService } from "../../services/loader.service";
import { GlobalErrorService } from "./global-error.service";
export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  totalCount?: number;
}

export type ApiRequestErrorHandler = (error: unknown) => void;

@Injectable({
  providedIn: "root",
})
export class ApiResponseService {
  private customToastService = inject(CustomToastService);
  private consoleLogger = inject(ConsoleLoggerService);
  private globalErrorService = inject(GlobalErrorService);
  private dataConnectorS = inject(DataConnectorService);
  private loaderS = inject(LoaderService);

  handleSuccess<T>(
    response: ApiResponseDto<T>,
    showSuccessToast: boolean = true,
    logColor: string = "green",
    urlApi?: string,
  ): T | null {
    if (response.success) {
      if (showSuccessToast && response.message) {
        this.customToastService.showSuccess("Exito", response.message);
      }
      if (urlApi) {
        this.consoleLogger.custom(
          "",
          logColor,
          `[API SUCCESS]: ${urlApi}`,
          response.data,
        );
      }
      return response.data;
    }
    return null;
  }

  handleError<T>(response: ApiResponseDto<T>, urlApi?: string): void {
    const errorMessage =
      response.message || "No se pudo completar la operacion.";
    this.customToastService.showError("Error", errorMessage);
    this.globalErrorService.setGlobalError(errorMessage);
    if (response.errors && response.errors.length > 0) {
      response.errors.forEach((error) => {
        this.customToastService.showError("Error", error);
      });
    }
    if (urlApi) {
      this.consoleLogger.error(`[API ERROR]: ${urlApi}`, {
        message: errorMessage,
        errors: response.errors,
      });
    }
  }

  processResponse<T>(
    response: ApiResponseDto<T>,
    options?: {
      showSuccessToast?: boolean;
      showErrorToast?: boolean;
      logColor?: string;
      urlApi?: string;
    },
  ): T | null {
    const {
      showSuccessToast = true,
      showErrorToast = true,
      logColor = "green",
      urlApi,
    } = options || {};

    if (response.success) {
      return this.handleSuccess(response, showSuccessToast, logColor, urlApi);
    } else {
      if (showErrorToast) {
        this.handleError(response, urlApi);
      }
      return null;
    }
  }

  isSuccess<T>(response: ApiResponseDto<T>): boolean {
    return response?.success === true;
  }

  getErrors<T>(response: ApiResponseDto<T>): string[] {
    return response?.errors || [];
  }

  getMessage<T>(response: ApiResponseDto<T>): string {
    return response?.message || "";
  }

  getTotalCount<T>(response: ApiResponseDto<T>): number | undefined {
    return response?.totalCount;
  }

  // ============================================================================
  // METODOS DE PETICIONES HTTP
  // ============================================================================

  async onGetList<T>(
    urlApi: string,
    httpParams?: unknown,
    showLog: boolean = true,
  ): Promise<T | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.get<ApiResponseDto<T>>(urlApi, httpParams),
      );
      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logColor: "teal",
        urlApi: showLog ? `GET LIST: ${urlApi}` : undefined,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: GET LIST: ${urlApi}`, errorMessage);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  async onGetPaged<T>(
    urlApi: string,
    httpParams?: unknown,
  ): Promise<ApiResponseDto<T> | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.get<ApiResponseDto<T>>(urlApi, httpParams),
      );
      if (responseData.body.success) {
        this.consoleLogger.custom(
          "",
          "blue",
          `[GET PAGED]: ${urlApi}`,
          responseData.body.data,
        );
        return responseData.body;
      } else {
        this.handleError(responseData.body, urlApi);
        return null;
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: GET PAGED: ${urlApi}`, error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  async onGetItem<T>(
    urlApi: string,
    showLoader: boolean = true,
  ): Promise<T | null> {
    if (showLoader) this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.get<ApiResponseDto<T>>(urlApi),
      );
      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logColor: "dodgerblue",
        urlApi: `GET ITEM: ${urlApi}`,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: GET ITEM: ${urlApi}`, error);
      return null;
    } finally {
      if (showLoader) this.loaderS.hide();
    }
  }

  async onPost<T>(
    urlApi: string,
    data: unknown = null,
    onRequestError?: ApiRequestErrorHandler,
    showLoader: boolean = true
  ): Promise<T | false> {
    if (showLoader) this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.post<ApiResponseDto<T>>(urlApi, data),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logColor: "green",
        urlApi: `POST: ${urlApi}`,
      });
      return result !== null ? result : false;
    } catch (error: unknown) {
      this.notifyRequestError(onRequestError, error);
      const errorMessage = this.resolveRequestErrorMessage(error);
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: POST: ${urlApi}`, error);
      return false;
    } finally {
      if (showLoader) this.loaderS.hide();
    }
  }

  async onPostPaged<T>(
    urlApi: string,
    data: unknown,
  ): Promise<ApiResponseDto<T> | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.post<ApiResponseDto<T>>(urlApi, data),
      );
      if (responseData.body.success) {
        this.consoleLogger.custom(
          "",
          "purple",
          `[POST PAGED]: ${urlApi}`,
          responseData.body.data,
        );
        return responseData.body;
      } else {
        this.handleError(responseData.body, urlApi);
        return null;
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: POST PAGED: ${urlApi}`, error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  async onPut<T>(
    urlApi: string,
    data: unknown,
    showSuccess: boolean = true,
    showLoader: boolean = true,
    onRequestError?: ApiRequestErrorHandler,
  ): Promise<T | false> {
    if (showLoader) this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.put<ApiResponseDto<T>>(urlApi, data),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: showSuccess,
        logColor: "mediumslateblue",
        urlApi: `PUT: ${urlApi}`,
      });
      return result !== null ? result : false;
    } catch (error: unknown) {
      this.notifyRequestError(onRequestError, error);
      const errorMessage = this.resolveRequestErrorMessage(error);
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: PUT: ${urlApi}`, error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  async onPatch<T>(
    urlApi: string,
    data: unknown,
    showSuccess: boolean = true,
  ): Promise<T | false> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.patch<ApiResponseDto<T>>(urlApi, data),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: showSuccess,
        logColor: "orange",
        urlApi: `PATCH: ${urlApi}`,
      });
      return result !== null ? result : false;
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: PATCH: ${urlApi}`, error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  async onDelete(urlApi: string): Promise<boolean> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.delete<ApiResponseDto<unknown>>(urlApi),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logColor: "crimson",
        urlApi: `DELETE: ${urlApi}`,
      });
      return result !== null;
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: DELETE: ${urlApi}`, error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }

  async onGetSelectItem<T>(urlApi: string): Promise<T | null> {
    return this.onGetItem<T>(`select-items/${urlApi}`);
  }

  async onGetEnumSelectItem<T>(urlApi: string): Promise<T | null> {
    return this.onGetItem<T>(`select-item-enum/${urlApi}`);
  }

  async onGetListNotLoading<T>(
    urlApi: string,
    httpParams?: unknown,
  ): Promise<T | null> {
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.get<ApiResponseDto<T>>(urlApi, httpParams),
      );
      return this.processResponse(responseData.body, {
        showSuccessToast: false,
        logColor: "gray",
        urlApi: `GET NoLoading: ${urlApi}`,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: GET NoLoading: ${urlApi}`, error);
      return null;
    }
  }

  async onPostNotLoading<T>(urlApi: string, data: unknown): Promise<T | false> {
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.post<ApiResponseDto<T>>(urlApi, data),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: false,
        logColor: "green",
        urlApi: `POST NoLoading: ${urlApi}`,
      });
      return result !== null ? result : false;
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: POST NoLoading: ${urlApi}`, error);
      return false;
    }
  }

  async onPostBlob(urlApi: string, data: unknown): Promise<Blob | null> {
    try {
      const response = await lastValueFrom(
        this.dataConnectorS.postFile(urlApi, data),
      );
      return response;
    } catch (error: unknown) {
      this.consoleLogger.error("API Error (Blob)", error);
      if (
        error instanceof Object &&
        (error as { error?: unknown }).error instanceof Blob &&
        (error as { error: Blob }).error.type === "application/json"
      ) {
        try {
          const text = await (error as { error: Blob }).error.text();
          const jsonError = JSON.parse(text) as {
            message?: string;
            title?: string;
          };
          const message =
            jsonError.message || jsonError.title || "Error desconocido";
          this.globalErrorService.setGlobalError(message);
          console.error("Parsed Blob Error:", jsonError);
        } catch (e) {
          console.error("Error parsing blob error", e);
          this.globalErrorService.setGlobalError(
            "Error desconocido al procesar la imagen.",
          );
        }
      } else {
        this.globalErrorService.setGlobalError(
          "Error de conexion al generar la imagen.",
        );
      }
      return null;
    }
  }

  async onDownloadFile(urlApi: string, nameDocument: string): Promise<void> {
    this.loaderS.show();
    try {
      const resp = await lastValueFrom(this.dataConnectorS.getFile(urlApi));
      const blob = new Blob([resp], { type: resp.type });
      saveAs(blob, nameDocument);
      this.customToastService.showSuccess(
        "Completado",
        "El archivo se descargo correctamente.",
      );
      this.consoleLogger.custom("", "darkgreen", `[Download OK]: ${urlApi}`);
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: Download: ${urlApi}`, error);
    } finally {
      this.loaderS.hide();
    }
  }

  async onPreviewPdf(urlApi: string): Promise<void> {
    this.loaderS.show();
    try {
      const resp = await lastValueFrom(this.dataConnectorS.getFile(urlApi));
      const blob = new Blob([resp], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      this.consoleLogger.custom("", "darkblue", `[Preview PDF OK]: ${urlApi}`);
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo cargar el PDF.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: Preview PDF: ${urlApi}`, error);
    } finally {
      this.loaderS.hide();
    }
  }

  async onDownloadFilePost(
    urlApi: string,
    body: unknown,
    nameDocument: string,
  ): Promise<void> {
    this.loaderS.show();
    try {
      const resp = await lastValueFrom(
        this.dataConnectorS.postFile(urlApi, body),
      );
      const blob = new Blob([resp], { type: resp.type });
      saveAs(blob, nameDocument);
      this.customToastService.showSuccess(
        "Completado",
        "El archivo se descargo correctamente.",
      );
      this.consoleLogger.custom(
        "",
        "darkgreen",
        `[Download POST OK]: ${urlApi}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: Download POST: ${urlApi}`, error);
    } finally {
      this.loaderS.hide();
    }
  }

  exportToExcel(urlApi: string, nameDocument: string): void {
    void this.onDownloadFile(urlApi, nameDocument);
  }

  async getBlobFileFromFullUrl(
    fullUrl: string,
    httpParams?: unknown,
  ): Promise<Blob | null> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.getFileFromFullUrl(fullUrl, httpParams),
      );
      this.consoleLogger.custom(
        "",
        "teal",
        `[GET BLOB FROM FULL URL OK]: ${fullUrl}`,
      );
      return responseData;
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: BLOB FROM URL: ${fullUrl}`, error);
      return null;
    } finally {
      this.loaderS.hide();
    }
  }

  validateForm(form: FormGroup): boolean {
    if (form.invalid) {
      Object.values(form.controls).forEach((control) => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  private notifyRequestError(
    handler: ApiRequestErrorHandler | undefined,
    error: unknown,
  ): void {
    if (!handler) return;

    try {
      handler(error);
    } catch (handlerError) {
      this.consoleLogger.error(
        "Error al ejecutar el callback de diagnóstico HTTP",
        handlerError,
      );
    }
  }

  private resolveRequestErrorMessage(error: unknown): string {
    const httpError = error as {
      status?: number;
      message?: string;
      error?: string | { Message?: string; message?: string; title?: string };
    };
    const responseError = httpError?.error;

    if (typeof responseError === "string" && responseError.trim()) {
      return responseError;
    }

    if (responseError && typeof responseError === "object") {
      const serverMessage =
        responseError.Message || responseError.message || responseError.title;
      if (serverMessage) return serverMessage;
    }

    if (httpError?.status === 0) {
      return "No se pudo conectar con el servidor. Revisa la conexión o vuelve a intentar.";
    }

    return httpError?.message || "No se pudo completar la operación.";
  }

  async onPostFile<T>(urlApi: string, data: FormData): Promise<T | false> {
    this.loaderS.show();
    try {
      const responseData = await lastValueFrom(
        this.dataConnectorS.post<ApiResponseDto<T>>(urlApi, data),
      );
      const result = this.processResponse(responseData.body, {
        showSuccessToast: true,
        logColor: "blue",
        urlApi: `POST FILE: ${urlApi}`,
      });
      return result !== null ? result : false;
    } catch (error: unknown) {
      const errorMessage =
        (error as { error?: { Message?: string } }).error?.Message ||
        "No se pudo completar la operacion.";
      this.customToastService.showError("Error", errorMessage);
      this.globalErrorService.setGlobalError(errorMessage);
      this.consoleLogger.error(`API Error: POST FILE: ${urlApi}`, error);
      return false;
    } finally {
      this.loaderS.hide();
    }
  }
}
