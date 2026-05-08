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
import { ApiResponseService } from "../services/api-response.service";

export interface CrudSubmitOptions {
  /** El FormGroup del formulario */
  form: FormGroup;
  /** Servicio de API */
  api: ApiResponseService;
  /** Endpoint base, ej: 'Banks' */
  endpoint: string;
  /** ID del registro (vacío/null para creación) */
  id: string | null;
  /** Referencia al dialogo para cerrarlo al completar */
  ref: DynamicDialogRef;
  /** Signal de loading para deshabilitar el botón */
  submitting: WritableSignal<boolean>;
  /** Transformación opcional del payload antes de enviar */
  transformPayload?: (value: any) => any;
}

export class FormHelper {
  /**
   * Ejecuta el patrón POST/PUT estándar para formularios CRUD.
   *
   * @returns Promise<boolean> - true si la operación fue exitosa
   *
   * Antes (repetido 141+ veces):
   * ```ts
   * onSubmit() {
   *   if (!this.apiResponseS.validateForm(this.form)) return;
   *   this.submitting.set(true);
   *   if (!this.id) {
   *     this.apiResponseS.onPost(url, this.form.value).then(r => ...);
   *   } else {
   *     this.apiResponseS.onPut(url + '/' + this.id, this.form.value).then(r => ...);
   *   }
   * }
   * ```
   *
   * Después:
   * ```ts
   * onSubmit() {
   *   FormHelper.submitCrud({
   *     form: this.form,
   *     api: this.apiResponseS,
   *     endpoint: 'Banks',
   *     id: this.id,
   *     ref: this.ref,
   *     submitting: this.submitting,
   *   });
   * }
   * ```
   */
  static async submitCrud(options: CrudSubmitOptions): Promise<boolean> {
    const { form, api, endpoint, id, ref, submitting, transformPayload } =
      options;

    // Validar formulario
    if (!api.validateForm(form)) return false;

    submitting.set(true);

    const payload = transformPayload
      ? transformPayload(form.value)
      : form.value;

    try {
      let result: boolean;

      if (!id) {
        result = await api.onPost(endpoint, payload);
      } else {
        result = await api.onPut(`${endpoint}/${id}`, payload);
      }

      if (result) {
        ref.close(true);
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









