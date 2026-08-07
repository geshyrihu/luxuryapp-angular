import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportService {
  /**
   * Descarga blob como archivo.
   * @param blob Contenido del archivo
   * @param filename Nombre del archivo descargado
   * @param mimeType MIME type (ej: 'application/pdf')
   */
  downloadFile(blob: Blob, filename: string, mimeType: string = 'application/octet-stream'): void {
    const file = new Blob([blob], { type: mimeType });
    saveAs(file, filename);
  }

  /**
   * Descarga desde URL (backend).
   * @param apiUrl URL del endpoint de descarga
   * @param filename Nombre del archivo
   */
  downloadFromUrl(apiUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = apiUrl;
    link.download = filename;
    link.click();
  }

  /**
   * Descarga con timestamp para evitar caché.
   */
  downloadFileWithTimestamp(
    blob: Blob,
    baseFileName: string,
    extension: string,
    mimeType: string
  ): void {
    const timestamp = this.getTimestamp();
    const filename = `${baseFileName}_${timestamp}.${extension}`;
    this.downloadFile(blob, filename, mimeType);
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[-:]/g, '').substring(0, 15);
  }
}
