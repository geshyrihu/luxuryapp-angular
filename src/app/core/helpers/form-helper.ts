/**
 * 🛠️ FORM HELPER - Reduce boilerplate en formularios CRUD
 * -------------------------------------------------------------------------
 * Centraliza el patrón de submit que se repite en 141+ formularios:
 *   if (!id) { POST } else { PUT }
 *
 * Uso:
 *   FormHelper.submitCrud({
 *     form: this.form,
 *     api: this.apiResponseS,
 *     endpoint: 'Banks',
 *     id: this.id,
 *     ref: this.ref,
 *     submitting: this.submitting,
 *   });
 */
import { WritableSignal } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

export interface CrudSubmitOptions {
  /** El FormGroup del formulario */
  form: FormGroup;
  /** Servicio de API */
  api: ApiResponseService;
  /** Endpoint base o completo. */
  endpoint: string;
  /** ID del registro (opcional). Si se provee y no se especifica method, se usará PUT. */
  id?: string | null;
  /** Referencia al dialogo para cerrarlo al completar (opcional si closeOnSuccess es false o no es un modal) */
  ref?: DynamicDialogRef;
  /** Signal de loading para deshabilitar el botón */
  submitting: WritableSignal<boolean>;
  /** Transformación opcional del payload antes de enviar */
  transformPayload?: (value: any) => any;
  /** Indica si se debe cerrar el diálogo tras éxito. Por defecto true. */
  closeOnSuccess?: boolean;
  /** Método HTTP explícito (POST, PUT, PATCH). Si no se provee, se infiere del ID. */
  method?: "POST" | "PUT" | "PATCH";
}

export class FormHelper {
  /**
   * Ejecuta el patrón POST/PUT/PATCH estándar para formularios CRUD.
   */
  static async submitCrud(options: CrudSubmitOptions): Promise<any> {
    const {
      form,
      api,
      endpoint,
      id,
      ref,
      submitting,
      transformPayload,
      closeOnSuccess = true,
      method,
    } = options;

    // Validar formulario
    if (!api.validateForm(form)) return false;

    submitting.set(true);

    const payload = transformPayload
      ? transformPayload(form.value)
      : form.value;

    try {
      let result: any;
      const url = id && !endpoint.includes(id) ? `${endpoint}/${id}` : endpoint;

      const httpMethod = method || (id ? "PUT" : "POST");

      switch (httpMethod) {
        case "PATCH":
          result = await api.onPatch(url, payload);
          break;
        case "PUT":
          result = await api.onPut(url, payload);
          break;
        default:
          result = await api.onPost(url, payload);
          break;
      }

      if (result !== false) {
        if (closeOnSuccess && ref) {
          ref.close(true);
        } else {
          submitting.set(false);
        }
      } else {
        submitting.set(false);
      }

      return result;
    } catch {
      submitting.set(false);
      return false;
    }
  }
}
