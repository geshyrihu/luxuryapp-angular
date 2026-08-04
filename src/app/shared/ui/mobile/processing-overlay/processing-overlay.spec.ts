import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MobileProcessingOverlay } from "./processing-overlay";

describe("MobileProcessingOverlay", () => {
  let component: MobileProcessingOverlay;
  let fixture: ComponentFixture<MobileProcessingOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileProcessingOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileProcessingOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display overlay when isProcessing is true", () => {
    fixture.componentRef.setInput("isProcessing", true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector(".bg-black\\/50");
    expect(overlay).toBeTruthy();
  });
});
