vi.mock("@ionic/angular", () => ({}));
vi.mock("@ionic/core", () => ({}));
vi.mock("@ionic/core/components", () => ({}));

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ImageProcessingService } from "@core/services/image-processing.service";
import { MessageService } from "@core/services/message.service";
import { TicketAnalysisService } from "@operations.luxuryapp/service-orders/service-order/services/ticket-analysis.service";
import { Subject } from "rxjs";
import { ImageAnalysisDialogComponent } from "./image-analysis-dialog";

describe("ImageAnalysisDialogComponent", () => {
  let component: ImageAnalysisDialogComponent;
  let fixture: ComponentFixture<ImageAnalysisDialogComponent>;

  const mockMessageService = {
    add: vi.fn(),
    messageObserver: new Subject(),
    clearObserver: new Subject(),
  };

  const mockImageProcessing = {
    processImage: vi.fn((file: File) => Promise.resolve(file)),
  };

  beforeEach(() => {
    const ticketAnalysisS = { analyzeImage: vi.fn() } as any;
    mockImageProcessing.processImage.mockImplementation((file: File) =>
      Promise.resolve(file),
    );

    if (!URL.createObjectURL) {
      URL.createObjectURL = vi.fn(() => "blob:mock") as any;
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = vi.fn() as any;
    }

    TestBed.configureTestingModule({
      imports: [ImageAnalysisDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: TicketAnalysisService, useValue: ticketAnalysisS },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ImageProcessingService, useValue: mockImageProcessing },
      ],
    });
    fixture = TestBed.createComponent(ImageAnalysisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start with hidden", () => {
    expect(component.visible).toBe(false);
  });

  it("should start with no file selected", () => {
    expect(component.selectedFile).toBeNull();
    expect(component.previewUrl).toBeNull();
    expect(component.analysisResult).toBeNull();
    expect(component.loading).toBe(false);
  });

  it("show should set visible true and reset state", () => {
    component.analysisResult = "old result";
    component.selectedFile = {} as File;
    component.previewUrl = "data:...";
    component.show();
    expect(component.visible).toBe(true);
    expect(component.selectedFile).toBeNull();
    expect(component.previewUrl).toBeNull();
    expect(component.analysisResult).toBeNull();
    expect(component.loading).toBe(false);
  });

  it("reset should clear all state", () => {
    component.selectedFile = {} as File;
    component.previewUrl = "data:...";
    component.analysisResult = "result";
    component.loading = true;
    component.reset();
    expect(component.selectedFile).toBeNull();
    expect(component.previewUrl).toBeNull();
    expect(component.analysisResult).toBeNull();
    expect(component.loading).toBe(false);
  });

  it("onFileSelect should set selectedFile", async () => {
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    const event = { target: { files: [file] } };
    await component.onFileSelect(event);
    expect(component.selectedFile).toBe(file);
  });

  it("onFileSelect should handle empty files", async () => {
    await component.onFileSelect({ target: { files: [] } });
    expect(component.selectedFile).toBeNull();
  });

  it("analyze should do nothing when no file", async () => {
    const service = TestBed.inject(TicketAnalysisService);
    component.selectedFile = null;
    await component.analyze();
    expect(service.analyzeImage).not.toHaveBeenCalled();
  });

  it("analyze should set analysisResult on success", async () => {
    const service = TestBed.inject(TicketAnalysisService);
    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    component.selectedFile = file;
    (service.analyzeImage as any).mockResolvedValue("Analysis result text");
    await component.analyze();
    expect(component.analysisResult).toBe("Analysis result text");
    expect(component.loading).toBe(false);
  });

  it("analyze should handle error", async () => {
    const service = TestBed.inject(TicketAnalysisService);
    component.selectedFile = new File(["dummy"], "test.jpg", {
      type: "image/jpeg",
    });
    (service.analyzeImage as any).mockRejectedValue(new Error("fail"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await component.analyze();
    expect(mockMessageService.add).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    consoleSpy.mockRestore();
  });

  it("useResult should emit resultAccepted and close", () => {
    const emitSpy = vi.fn();
    component.resultAccepted.subscribe(emitSpy);
    component.analysisResult = "result text";
    component.useResult();
    expect(emitSpy).toHaveBeenCalledWith("result text");
    expect(component.visible).toBe(false);
  });

  it("useResult should not emit when result is empty", () => {
    const emitSpy = vi.fn();
    component.resultAccepted.subscribe(emitSpy);
    component.analysisResult = "";
    component.useResult();
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
