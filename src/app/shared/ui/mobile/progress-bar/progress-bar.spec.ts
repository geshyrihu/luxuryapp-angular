import { TestBed } from "@angular/core/testing";
import { MobileProgressBar } from "./progress-bar";

describe("MobileProgressBar (render)", () => {
  it("renders with fraction converted from percentage", () => {
    TestBed.configureTestingModule({ imports: [MobileProgressBar] });
    const fixture = TestBed.createComponent(MobileProgressBar);
    fixture.componentRef.setInput("value", 40);
    fixture.componentRef.setInput("color", "warning");
    fixture.detectChanges();
    expect(fixture.componentInstance.fraction()).toBeCloseTo(0.4);
    expect(fixture.componentInstance.ionColor()).toBe("warning");
  });
});
