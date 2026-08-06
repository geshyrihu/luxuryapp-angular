import { HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { firstValueFrom, of } from "rxjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageProcessingService } from "../../services/image-processing.service";
import { imageFormDataInterceptor } from "./image-form-data.interceptor.fn";

describe("imageFormDataInterceptor", () => {
  const imageProcessing = {
    processFormData: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        { provide: ImageProcessingService, useValue: imageProcessing },
      ],
    });
  });

  it("replaces a FormData body with the centrally processed body", async () => {
    const originalBody = new FormData();
    originalBody.append("file", new File(["heic"], "photo.heic"));
    const processedBody = new FormData();
    processedBody.append(
      "file",
      new File(["jpeg"], "photo.jpg", { type: "image/jpeg" }),
    );
    imageProcessing.processFormData.mockResolvedValue(processedBody);
    const next = vi.fn((request: HttpRequest<unknown>) =>
      of(new HttpResponse({ body: request.body })),
    );
    const request = new HttpRequest(
      "POST",
      "/service-orders/subir-img",
      originalBody,
    );

    const response = await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        imageFormDataInterceptor(request, next),
      ),
    );

    expect(imageProcessing.processFormData).toHaveBeenCalledWith(originalBody);
    expect((response as HttpResponse<unknown>).body).toBe(processedBody);
  });

  it("does not inspect non-FormData request bodies", async () => {
    const next = vi.fn((request: HttpRequest<unknown>) =>
      of(new HttpResponse({ body: request.body })),
    );
    const request = new HttpRequest("POST", "/tasks", { title: "Task" });

    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        imageFormDataInterceptor(request, next),
      ),
    );

    expect(imageProcessing.processFormData).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(request);
  });
});
