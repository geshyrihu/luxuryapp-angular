import { Injectable, inject } from "@angular/core";
import {
  HeicConversionMethod,
  HeicConverterService,
} from "./heic-converter.service";

export interface ImageProcessingOptions {
  maxBytes?: number;
  maxDimension?: number;
  quality?: number;
  minQuality?: number;
  qualityStep?: number;
}

export interface ImageProcessingMetadata {
  originalName: string;
  originalSize: number;
  wasHeic: boolean;
  conversionMethod: HeicConversionMethod | null;
  resizedOrCompressed: boolean;
}

export type ImageProcessingErrorCode =
  "unsupported-format" | "decode-failed" | "output-too-large";

export class ImageProcessingError extends Error {
  constructor(
    readonly code: ImageProcessingErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ImageProcessingError";
  }
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_DIMENSION = 2560;
const DEFAULT_QUALITY = 0.85;
const DEFAULT_MIN_QUALITY = 0.4;
const DEFAULT_QUALITY_STEP = 0.1;
const IMAGE_LOAD_TIMEOUT_MS = 15000;
const MIN_DIMENSION = 640;

const RASTER_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif)$/i;
const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const HEIC_MIME_TYPES = new Set(["image/heic", "image/heif"]);
const BROWSER_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
]);

/**
 * Punto de entrada unico para preparar imagenes antes de subirlas.
 *
 * Convierte HEIC/HEIF localmente, limita dimensiones, comprime a JPEG cuando
 * es necesario y conserva sin cambios los archivos que ya cumplen el perfil.
 */
@Injectable({ providedIn: "root" })
export class ImageProcessingService {
  private readonly heicConverter = inject(HeicConverterService);
  private readonly metadata = new WeakMap<File, ImageProcessingMetadata>();

  async processImage(
    file: File,
    options: ImageProcessingOptions = {},
  ): Promise<File> {
    if (this.metadata.has(file)) return file;

    const normalizedOptions = this.normalizeOptions(options);
    const wasHeic = await this.isHeic(file);

    if (!wasHeic && !this.isBrowserImage(file)) {
      throw new ImageProcessingError(
        "unsupported-format",
        `El archivo "${file.name}" no es una imagen JPG, PNG, WebP, HEIC o HEIF compatible.`,
      );
    }

    let workingFile = file;
    let conversionMethod: HeicConversionMethod | null = null;

    if (wasHeic) {
      workingFile = await this.heicConverter.convertHeicToJpeg(file);
      conversionMethod = this.heicConverter.getConversionMethod(workingFile);
    }

    const processedFile = await this.resizeAndCompress(
      workingFile,
      normalizedOptions,
    );

    this.metadata.set(processedFile, {
      originalName: file.name,
      originalSize: file.size,
      wasHeic,
      conversionMethod,
      resizedOrCompressed:
        processedFile !== file && processedFile !== workingFile,
    });

    return processedFile;
  }

  async processImages(
    files: readonly File[],
    options: ImageProcessingOptions = {},
  ): Promise<File[]> {
    const processed: File[] = [];
    for (const file of files) {
      processed.push(await this.processImage(file, options));
    }
    return processed;
  }

  async processFileIfImage(
    file: File,
    options: ImageProcessingOptions = {},
  ): Promise<File> {
    return (await this.isImage(file)) ? this.processImage(file, options) : file;
  }

  async processFiles(
    files: readonly File[],
    options: ImageProcessingOptions = {},
  ): Promise<File[]> {
    const processed: File[] = [];
    for (const file of files) {
      processed.push(await this.processFileIfImage(file, options));
    }
    return processed;
  }

  /**
   * Prepara todos los archivos de imagen contenidos en un FormData y conserva
   * sin cambios sus campos de texto y archivos de otros tipos.
   *
   * Se crea una nueva instancia para no mutar el cuerpo original mientras una
   * solicitud puede estar siendo reintentada o almacenada para sincronizacion.
   */
  async processFormData(
    formData: FormData,
    options: ImageProcessingOptions = {},
  ): Promise<FormData> {
    const processedFormData = new FormData();

    for (const [key, value] of formData.entries()) {
      if (typeof File !== "undefined" && value instanceof File) {
        const processedFile = await this.processFileIfImage(value, options);
        processedFormData.append(key, processedFile, processedFile.name);
      } else {
        processedFormData.append(key, value);
      }
    }

    return processedFormData;
  }

  async isImage(file: File): Promise<boolean> {
    return this.isBrowserImage(file) || (await this.isHeic(file));
  }

  getMetadata(file: File): ImageProcessingMetadata | null {
    return this.metadata.get(file) ?? null;
  }

  private async isHeic(file: File): Promise<boolean> {
    if (HEIC_EXTENSIONS.test(file.name) || HEIC_MIME_TYPES.has(file.type)) {
      return true;
    }

    const hasAmbiguousType =
      file.type === "" || file.type === "application/octet-stream";
    if (!hasAmbiguousType || RASTER_EXTENSIONS.test(file.name)) return false;

    try {
      return await this.heicConverter.isHeic(file);
    } catch {
      return false;
    }
  }

  private isBrowserImage(file: File): boolean {
    return (
      BROWSER_IMAGE_MIME_TYPES.has(file.type) ||
      (/\.(jpe?g|png|webp)$/i.test(file.name) &&
        (file.type === "" || file.type === "application/octet-stream"))
    );
  }

  private normalizeOptions(
    options: ImageProcessingOptions,
  ): Required<ImageProcessingOptions> {
    const quality = Math.min(
      1,
      Math.max(0.1, options.quality ?? DEFAULT_QUALITY),
    );
    const minQuality = Math.min(
      quality,
      Math.max(0.05, options.minQuality ?? DEFAULT_MIN_QUALITY),
    );
    return {
      maxBytes: Math.max(1, options.maxBytes ?? DEFAULT_MAX_BYTES),
      maxDimension: Math.max(1, options.maxDimension ?? DEFAULT_MAX_DIMENSION),
      quality,
      minQuality,
      qualityStep: Math.min(
        quality,
        Math.max(0.01, options.qualityStep ?? DEFAULT_QUALITY_STEP),
      ),
    };
  }

  private async resizeAndCompress(
    file: File,
    options: Required<ImageProcessingOptions>,
  ): Promise<File> {
    const image = await this.loadImage(file);
    const requiresResize =
      image.naturalWidth > options.maxDimension ||
      image.naturalHeight > options.maxDimension;

    if (!requiresResize && file.size <= options.maxBytes) return file;

    const initialScale = Math.min(
      1,
      options.maxDimension / image.naturalWidth,
      options.maxDimension / image.naturalHeight,
    );
    let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
    let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
    let lastBlob: Blob | null = null;

    try {
      for (let resizeAttempt = 0; resizeAttempt < 5; resizeAttempt++) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        if (!context) {
          throw new ImageProcessingError(
            "decode-failed",
            "No se pudo crear el contexto para procesar la imagen.",
          );
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        for (
          let quality = options.quality;
          quality >= options.minQuality - Number.EPSILON;
          quality = +(quality - options.qualityStep).toFixed(2)
        ) {
          lastBlob = await this.canvasToBlob(canvas, quality);
          if (lastBlob.size <= options.maxBytes) {
            canvas.width = 1;
            canvas.height = 1;
            return this.toJpegFile(lastBlob, file);
          }
        }

        canvas.width = 1;
        canvas.height = 1;

        if (Math.min(width, height) <= MIN_DIMENSION) break;

        const scaleFromSize = Math.sqrt(
          options.maxBytes / Math.max(lastBlob?.size ?? options.maxBytes, 1),
        );
        const nextScale = Math.min(0.85, Math.max(0.5, scaleFromSize * 0.95));
        width = Math.max(1, Math.round(width * nextScale));
        height = Math.max(1, Math.round(height * nextScale));
      }
    } finally {
      image.src = "";
    }

    throw new ImageProcessingError(
      "output-too-large",
      `No se pudo reducir "${file.name}" al tamano maximo permitido.`,
    );
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
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
        reject(
          new ImageProcessingError(
            "decode-failed",
            `No se pudo leer la imagen "${file.name}".`,
            { cause: error },
          ),
        );
      };
      const timeoutId = window.setTimeout(
        () => fail(new Error("Tiempo agotado al decodificar la imagen")),
        IMAGE_LOAD_TIMEOUT_MS,
      );

      image.onload = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        cleanup();
        resolve(image);
      };
      image.onerror = () => fail(new Error("El navegador rechazo la imagen"));
      image.src = objectUrl;
    });
  }

  private canvasToBlob(
    canvas: HTMLCanvasElement,
    quality: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else {
            reject(
              new ImageProcessingError(
                "decode-failed",
                "El navegador no pudo generar la imagen procesada.",
              ),
            );
          }
        },
        "image/jpeg",
        quality,
      );
    });
  }

  private toJpegFile(blob: Blob, source: File): File {
    const baseName = source.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: source.lastModified,
    });
  }
}
