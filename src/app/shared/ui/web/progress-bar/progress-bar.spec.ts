import { TestBed } from "@angular/core/testing";
import { AppProgressBar } from "./progress-bar";

describe("AppProgressBar (render)", () => {
  it("renders determinate with clamped value", () => {
    TestBed.configureTestingModule({ imports: [AppProgressBar] });
    const fixture = TestBed.createComponent(AppProgressBar);
    fixture.componentRef.setInput("value", 60);
    fixture.componentRef.setInput("color", "success");
    fixture.detectChanges();
    expect(fixture.componentInstance.clampedValue()).toBe(60);
  });

  it("renders indeterminate mode", () => {
    TestBed.configureTestingModule({ imports: [AppProgressBar] });
    const fixture = TestBed.createComponent(AppProgressBar);
    fixture.componentRef.setInput("mode", "indeterminate");
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
