import { Injectable, signal } from "@angular/core";

/**
 * 📏 TABLE SCROLL HEIGHT SERVICE
 * -------------------------------------------------------------------------
 * Servicio global para calcular dinámicamente la altura de scroll de tablas PrimeNG.
 * Calcula el espacio disponible restando los elementos fijos del viewport.
 *
 * Uso:
 * ```typescript
 * scrollHeight = this.tableScrollHeightS.scrollHeight;
 * ```
 * En el template:
 * ```html
 * [scrollHeight]="scrollHeight"
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class TableScrollHeightService {
  // Elementos fijos que ocupan espacio vertical:
  // - Topbar: ~60px
  // - Caption (búsqueda + botones): ~70px (aumentado para dar más espacio)
  // - Table Header (columnas): ~45px
  // - Paginator: ~60px
  // - Padding/Margins: ~25px
  // Total: ~285px (ajustado para evitar desbordamiento y scroll del navegador)
  private readonly FIXED_ELEMENTS_HEIGHT = 240;

  // Signal reactivo que contiene la altura calculada
  scrollHeight = signal<string>(this.calculateScrollHeight());

  constructor() {
    // Listener global para recalcular cuando cambia el tamaño de la ventana
    window.addEventListener("resize", () => {
      this.scrollHeight.set(this.calculateScrollHeight());
    });
  }

  /**
   * Calcula la altura disponible para el scroll de la tabla
   * @returns String con la altura en píxeles (ej: "600px")
   */
  private calculateScrollHeight(): string {
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - this.FIXED_ELEMENTS_HEIGHT;
    return `${availableHeight}px`;
  }

  /**
   * Permite ajustar manualmente el offset de elementos fijos si es necesario
   * @param offset Altura adicional a restar (en píxeles)
   */
  setCustomOffset(offset: number): void {
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - offset;
    this.scrollHeight.set(`${availableHeight}px`);
  }
}









