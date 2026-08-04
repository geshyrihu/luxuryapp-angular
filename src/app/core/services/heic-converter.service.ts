import { Injectable } from "@angular/core";

type HeicToModule = typeof import("heic-to/csp");
export type HeicConversionMethod = "native" | "heic-to";

const DEFAULT_JPEG_QUALITY = 0.85;
const DEFAULT_MAX_DIMENSION = 2560;
const NATIVE_DECODE_TIMEOUT_MS = 15000;
const FALLBACK_DECODE_TIMEOUT_MS = 45000;

/**
 * Convierte imágenes HEIC/HEIF a JPEG dentro del navegador.
 *
 * La variante CSP de heic-to se carga bajo demanda y queda cacheada por el
 * servicio. No se envían archivos a servicios externos.
 */
@Injectable({
  providedIn: "root",
})
export class HeicConverterService {
  private modulePromise: Promise<HeicToModule> | null = null;
  private conversionMethods = new WeakMap<File, HeicConversionMethod>();

  async isHeic(file: File): Promise<boolean> {
    const brandBuffer = await file.slice(8, 12).arrayBuffer();
    if (brandBuffer.byteLength < 4) return false;

    const brand = new TextDecoder("utf-8")
      .decode(brandBuffer)
      .replace("\0", " ")
      .trim();

    return ["mif1", "msf1", "heic", "heix", "hevc", "hevx"].includes(brand);
  }

  async convertHeicToJpeg(file: File): Promise<File> {
    try {
      let conversionMethod: HeicConversionMethod = "native";
      const convertedBlob = await this.convertWithNativeDecoder(file).catch(
        async (nativeError: unknown) => {
          conversionMethod = "heic-to";
          console.info(
            "[HEIC_CONVERTER] El navegador no pudo decodificar HEIC nativamente; usando fallback.",
            nativeError,
          );
          return this.convertWithHeicTo(file);
        },
      );
      const baseName = file.name.replace(/\.(heic|heif)$/i, "");
      const fileName = `${baseName || "image"}.jpg`;
      const convertedFile = new File([convertedBlob], fileName, {
        type: "image/jpeg",
        lastModified: file.lastModified,
      });
      this.conversionMethods.set(convertedFile, conversionMethod);
      return convertedFile;
    } catch (error) {
      console.error("[HEIC_CONVERTER] Error al convertir HEIC:", error);
      throw new Error(
        "No se pudo convertir la foto HEIC. Intenta con una foto JPG/PNG.",
        { cause: error },
      );
    }
  }

  getConversionMethod(file: File): HeicConversionMethod | null {
    return this.conversionMethods.get(file) ?? null;
  }

  private loadModule(): Promise<HeicToModule> {
    this.modulePromise ??= import("heic-to/csp");
    return this.modulePromise;
  }

  private convertWithNativeDecoder(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);
      let settled = false;

      const cleanup = (): void => {
        URL.revokeObjectURL(objectUrl);
        image.onload = null;
        image.onerror = null;
      };

      const fail = (error: Error): void => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        cleanup();
        reject(error);
      };

      const timeoutId = window.setTimeout(
        () => fail(new Error("Tiempo agotado al decodificar HEIC nativamente")),
        NATIVE_DECODE_TIMEOUT_MS,
      );

      image.onload = () => {
        if (settled) return;

        try {
          const { width, height } = this.fitWithinDimension(
            image.naturalWidth,
            image.naturalHeight,
            DEFAULT_MAX_DIMENSION,
          );
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const context = canvas.getContext("2d");
          if (!context) {
            fail(new Error("No se pudo crear el contexto para convertir HEIC"));
            return;
          }

          context.drawImage(image, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              canvas.width = 1;
              canvas.height = 1;

              if (!blob) {
                fail(new Error("Safari no pudo generar el JPEG convertido"));
                return;
              }

              settled = true;
              clearTimeout(timeoutId);
              cleanup();
              resolve(blob);
            },
            "image/jpeg",
            DEFAULT_JPEG_QUALITY,
          );
        } catch (error) {
          fail(
            error instanceof Error
              ? error
              : new Error("Error desconocido en el decodificador nativo"),
          );
        }
      };

      image.onerror = () =>
        fail(
          new Error("El navegador no soporta la decodificación HEIC nativa"),
        );
      image.src = objectUrl;
    });
  }

  private async convertWithHeicTo(file: File): Promise<Blob> {
    const { heicTo } = await this.loadModule();
    const conversion = heicTo({
      blob: file,
      type: "image/jpeg",
      quality: DEFAULT_JPEG_QUALITY,
    });

    return this.withTimeout(
      conversion,
      FALLBACK_DECODE_TIMEOUT_MS,
      "Tiempo agotado al convertir HEIC con el decodificador alternativo",
    );
  }

  private fitWithinDimension(
    originalWidth: number,
    originalHeight: number,
    maxDimension: number,
  ): { width: number; height: number } {
    if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
      return { width: originalWidth, height: originalHeight };
    }

    const ratio = Math.min(
      maxDimension / originalWidth,
      maxDimension / originalHeight,
    );
    return {
      width: Math.max(1, Math.round(originalWidth * ratio)),
      height: Math.max(1, Math.round(originalHeight * ratio)),
    };
  }

  private withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    message: string,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = window.setTimeout(
        () => reject(new Error(message)),
        timeoutMs,
      );

      promise.then(
        (value) => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      );
    });
  }
}
