import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LxProcessingOverlay } from "./processing-overlay";

describe("LxProcessingOverlay", () => {
  let component: LxProcessingOverlay;
  let fixture: ComponentFixture<LxProcessingOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxProcessingOverlay],
    }).compileComponents();

    fixture = TestBed.createComponent(LxProcessingOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
