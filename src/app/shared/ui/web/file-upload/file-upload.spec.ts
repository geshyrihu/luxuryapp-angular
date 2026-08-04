import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FileUpload } from "./file-upload";
import { PlatformService } from "src/app/core/services/platform.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";
import { vi } from "vitest";

describe("FileUpload", () => {
  let component: FileUpload;
  let fixture: ComponentFixture<FileUpload>;
  const imageProcessing = {
    processFileIfImage: vi.fn((file: File) => Promise.resolve(file)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUpload],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: PlatformService,
          useValue: { isMobile: () => false },
        },
        { provide: ImageProcessingService, useValue: imageProcessing },
        { provide: CustomToastService, useValue: { showError: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should process images before emitting the selection", async () => {
    const source = new File(["source"], "photo.HEIC", { type: "image/heic" });
    const processed = new File(["jpeg"], "photo.jpg", { type: "image/jpeg" });
    imageProcessing.processFileIfImage.mockResolvedValueOnce(processed);
    const emitSpy = vi.fn();
    component.onSelect.subscribe(emitSpy);

    await component.onFilesSelected({
      files: [source],
      originalEvent: new Event("change"),
    } as any);

    expect(imageProcessing.processFileIfImage).toHaveBeenCalledWith(source, {
      maxBytes: component.maxFileSize(),
    });
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ files: [processed] }),
    );
  });
});
