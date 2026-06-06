import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  /**
   * Prepara el DOM y ejecuta la impresion nativa.
   * @param elementId Opcional: El ID del contenedor que se desea imprimir.
   * @param documentTitle Titulo que aparecera en el encabezado del PDF impreso.
   */
  printElement(elementId?: string, documentTitle: string = 'Documento'): void {
    const originalTitle = document.title;
    document.title = documentTitle;
    
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    document.body.classList.add('is-printing');

    window.print();

    document.body.classList.remove('is-printing');
    document.title = originalTitle;
  }
}
