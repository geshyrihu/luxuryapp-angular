// src/app/core/services/loader.service.ts
import { Injectable, signal } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class LoaderService {
  // Un signal privado para controlar el estado
  private isLoading = signal<boolean>(false);

  // Un signal público de solo lectura para que los componentes lo consuman
  public readonly loading$ = this.isLoading.asReadonly();

  /** Muestra el loader */
  show() {
    this.isLoading.set(true);
  }

  /** Oculta el loader */
  hide() {
    this.isLoading.set(false);
  }
}









