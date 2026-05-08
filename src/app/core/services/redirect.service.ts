import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class RedirectService {
  /**
   * Almacena la URL a la que el usuario intentaba navegar
   * antes de ser interrumpido (ej. por falta de conexión).
   */
  public returnUrl: string | null = null;
}









