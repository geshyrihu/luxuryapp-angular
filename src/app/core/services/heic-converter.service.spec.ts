import { TestBed } from "@angular/core/testing";
import { heicTo } from "heic-to/csp";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeicConverterService } from "./heic-converter.service";

vi.mock("heic-to/csp", () => ({
  heicTo: vi.fn(),
}));

describe("HeicConverterService", () => {
  let service: HeicConverterService;
  let nativeDecoderSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeicConverterService);
    vi.clearAllMocks();
    nativeDecoderSpy = vi
      .spyOn(service as any, "convertWithNativeDecoder")
      .mockRejectedValue(new Error("native decoder unavailable"));
  });

  it("detects HEIC files using only the file signature", async () => {
    const header = new Uint8Array(12);
    header.set(new TextEncoder().encode("heic"), 8);
    const file = new File([header], "photo.bin", {
      type: "application/octet-stream",
    });

    await expect(service.isHeic(file)).resolves.toBe(true);
  });

  it("converts HEIC to a JPEG File preserving lastModified", async () => {
    const file = new File(["heic"], "IMG_1234.HEIC", {
      type: "image/heic",
      lastModified: 1234,
    });
    vi.mocked(heicTo).mockResolvedValue(
      new Blob(["jpeg"], { type: "image/jpeg" }),
    );

    const result = await service.convertHeicToJpeg(file);

    expect(heicTo).toHaveBeenCalledWith({
      blob: file,
      type: "image/jpeg",
      quality: 0.85,
    });
    expect(result.name).toBe("IMG_1234.jpg");
    expect(result.type).toBe("image/jpeg");
    expect(result.lastModified).toBe(1234);
    expect(service.getConversionMethod(result)).toBe("heic-to");
  });

  it("uses the browser native decoder before loading the fallback", async () => {
    const file = new File(["heic"], "IMG_5678.HEIC", {
      type: "image/heic",
    });
    nativeDecoderSpy.mockResolvedValue(
      new Blob(["native-jpeg"], { type: "image/jpeg" }),
    );

    const result = await service.convertHeicToJpeg(file);

    expect(result.name).toBe("IMG_5678.jpg");
    expect(result.type).toBe("image/jpeg");
    expect(service.getConversionMethod(result)).toBe("native");
    expect(heicTo).not.toHaveBeenCalled();
  });

  it("returns a controlled error when conversion fails", async () => {
    const file = new File(["invalid"], "photo.heic", {
      type: "image/heic",
    });
    vi.mocked(heicTo).mockRejectedValue(new Error("decoder failed"));

    await expect(service.convertHeicToJpeg(file)).rejects.toThrow(
      "No se pudo convertir la foto HEIC",
    );
  });
});
