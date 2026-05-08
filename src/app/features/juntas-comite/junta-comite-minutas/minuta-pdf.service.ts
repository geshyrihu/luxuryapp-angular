import { Injectable } from "@angular/core";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

/**
 * Servicio independiente para generación de PDF de minutas.
 * No reutiliza PdfGeneratorService para evitar encabezados, estilos
 * y márgenes propios de ese servicio genérico.
 */
@Injectable({ providedIn: "root" })
export class MinutaPdfService {
  private pdfMakeInstance: any;

  constructor() {
    this.pdfMakeInstance = (pdfMake as any).default || pdfMake;
    if (this.pdfMakeInstance.vfs === undefined) {
      const fonts = pdfFonts as any;
      this.pdfMakeInstance.vfs = fonts.pdfMake?.vfs || fonts;
    }
  }

  /** Convierte una URL remota a base64 data-URL para que pdfmake la acepte. */
  urlToBase64(url: string): Promise<string> {
    return fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
  }

  /** Descarga el PDF directamente sin ningún encabezado ni estilo extra. */
  download(docDefinition: TDocumentDefinitions, fileName: string): void {
    this.pdfMakeInstance.createPdf(docDefinition).download(`${fileName}.pdf`);
  }
}









