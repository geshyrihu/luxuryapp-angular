import { Injectable, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ImageCompressionService {
  /**
   * Comprime una imagen a un tamaño máximo especificado.
   * Usa canvas API para redimensionar y reducir calidad.
   * @param file Archivo de imagen a comprimir
   * @param maxSizeMB Tamaño máximo en MB (default: 2MB)
   * @returns Promise<File> Archivo comprimido
   */
  async compressImage(file: File, maxSizeMB: number = 2): Promise<File> {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size <= maxSizeBytes) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width;
              width = maxDimension;
            } else {
              width = (width * maxDimension) / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("No se pudo obtener el contexto del canvas"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.9;
          let compressedDataUrl = canvas.toDataURL(file.type, quality);

          while (
            this.base64ToBytes(compressedDataUrl).length > maxSizeBytes &&
            quality > 0.1
          ) {
            quality -= 0.1;
            compressedDataUrl = canvas.toDataURL(file.type, quality);
          }

          const compressedFile = this.dataUrlToFile(
            compressedDataUrl,
            file.name,
            file.type,
          );
          resolve(compressedFile);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private base64ToBytes(base64: string): number[] {
    const base64Data = base64.split(",")[1] || base64;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return Array.from(bytes);
  }

  private dataUrlToFile(
    dataUrl: string,
    fileName: string,
    mimeType: string,
  ): File {
    const base64Data = dataUrl.split(",")[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
  }
}
