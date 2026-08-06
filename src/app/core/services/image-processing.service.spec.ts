import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeicConverterService } from "./heic-converter.service";
import {
  ImageProcessingError,
  ImageProcessingService,
} from "./image-processing.service";

describe("ImageProcessingService", () => {
  let service: ImageProcessingService;
  const heicConverter = {
    isHeic: vi.fn(),
    convertHeicToJpeg: vi.fn(),
    getConversionMethod: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        ImageProcessingService,
        { provide: HeicConverterService, useValue: heicConverter },
      ],
    });
    service = TestBed.inject(ImageProcessingService);
  });

  it("processes browser-compatible images through the standard pipeline", async () => {
    const file = new File(["jpeg"], "photo.jpg", { type: "image/jpeg" });
    const processed = new File(["result"], "photo.jpg", {
      type: "image/jpeg",
    });
    vi.spyOn(service as any, "resizeAndCompress").mockResolvedValue(processed);

    await expect(service.processImage(file, { maxBytes: 1024 })).resolves.toBe(
      processed,
    );
  });

  it("converts HEIC before resizing and records the conversion strategy", async () => {
    const source = new File(["heic"], "IMG_1234.HEIC", {
      type: "image/heic",
    });
    const converted = new File(["jpeg"], "IMG_1234.jpg", {
      type: "image/jpeg",
    });
    heicConverter.convertHeicToJpeg.mockResolvedValue(converted);
    heicConverter.getConversionMethod.mockReturnValue("native");
    vi.spyOn(service as any, "resizeAndCompress").mockResolvedValue(converted);

    const result = await service.processImage(source);

    expect(heicConverter.convertHeicToJpeg).toHaveBeenCalledWith(source);
    expect(service.getMetadata(result)).toMatchObject({
      originalName: "IMG_1234.HEIC",
      wasHeic: true,
      conversionMethod: "native",
    });
  });

  it("detects HEIC files with an ambiguous MIME type", async () => {
    const source = new File(["heic"], "upload.bin", {
      type: "application/octet-stream",
    });
    const converted = new File(["jpeg"], "upload.jpg", {
      type: "image/jpeg",
    });
    heicConverter.isHeic.mockResolvedValue(true);
    heicConverter.convertHeicToJpeg.mockResolvedValue(converted);
    vi.spyOn(service as any, "resizeAndCompress").mockResolvedValue(converted);

    await expect(service.processImage(source)).resolves.toBe(converted);
  });

  it("leaves non-image files untouched in mixed upload collections", async () => {
    const pdf = new File(["pdf"], "document.pdf", {
      type: "application/pdf",
    });

    await expect(service.processFiles([pdf])).resolves.toEqual([pdf]);
  });

  it("processes image files inside FormData and preserves other values", async () => {
    const image = new File(["jpeg"], "photo.jpg", { type: "image/jpeg" });
    const processedImage = new File(["result"], "photo.jpg", {
      type: "image/jpeg",
    });
    const pdf = new File(["pdf"], "document.pdf", {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append("customerId", "42");
    formData.append("files", image);
    formData.append("files", pdf);
    vi.spyOn(service as any, "resizeAndCompress").mockResolvedValue(
      processedImage,
    );

    const result = await service.processFormData(formData);

    expect(result.get("customerId")).toBe("42");
    expect(result.getAll("files")).toEqual([processedImage, pdf]);
  });

  it("does not process the same image twice", async () => {
    const image = new File(["jpeg"], "photo.jpg", { type: "image/jpeg" });
    const resizeAndCompress = vi
      .spyOn(service as any, "resizeAndCompress")
      .mockResolvedValue(image);

    const firstResult = await service.processImage(image);
    const secondResult = await service.processImage(firstResult);

    expect(secondResult).toBe(firstResult);
    expect(resizeAndCompress).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported files when image processing is required", async () => {
    const file = new File(["text"], "notes.txt", { type: "text/plain" });

    await expect(service.processImage(file)).rejects.toBeInstanceOf(
      ImageProcessingError,
    );
  });
});
