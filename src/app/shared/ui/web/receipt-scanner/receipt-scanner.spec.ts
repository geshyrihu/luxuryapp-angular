import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppReceiptScanner } from "./receipt-scanner";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { vi } from "vitest";

describe("AppReceiptScanner", () => {
  let component: AppReceiptScanner;
  let fixture: ComponentFixture<AppReceiptScanner>;
  const imageProcessing = {
    processFileIfImage: vi.fn((file: File) => Promise.resolve(file)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppReceiptScanner],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ImageProcessingService, useValue: imageProcessing },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppReceiptScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit the centrally processed image", async () => {
    const source = new File(["heic"], "receipt.HEIC", { type: "image/heic" });
    const processed = new File(["jpeg"], "receipt.jpg", { type: "image/jpeg" });
    imageProcessing.processFileIfImage.mockResolvedValueOnce(processed);
    const emitSpy = vi.fn();
    component.fileSelected.subscribe(emitSpy);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:receipt");

    await component.processFile(source);

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ file: processed, previewUrl: "blob:receipt" }),
    );
  });
});
