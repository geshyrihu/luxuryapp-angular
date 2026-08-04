import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppProcessingOverlay } from "./processing-overlay";

describe("AppProcessingOverlay", () => {
  let component: AppProcessingOverlay;
  let fixture: ComponentFixture<AppProcessingOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppProcessingOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(AppProcessingOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display overlay when isProcessing is true", () => {
    fixture.componentRef.setInput("isProcessing", true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector(
      ".bg-black\\/40"
    );
    expect(overlay).toBeTruthy();
  });

  it("should hide overlay when isProcessing is false", () => {
    fixture.componentRef.setInput("isProcessing", false);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector(
      ".bg-black\\/40"
    );
    expect(overlay).toBeFalsy();
  });

  it("should display progress percentage", () => {
    fixture.componentRef.setInput("isProcessing", true);
    fixture.componentRef.setInput("progress", 45);
    fixture.detectChanges();

    const progressText = fixture.nativeElement.textContent;
    expect(progressText).toContain("45%");
  });
});
