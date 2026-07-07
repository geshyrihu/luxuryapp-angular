import { TestBed } from "@angular/core/testing";
import { MobileSpinner } from "./spinner";

describe("MobileSpinner (render)", () => {
  it("renders crescent spinner with mapped color", () => {
    TestBed.configureTestingModule({ imports: [MobileSpinner] });
    const fixture = TestBed.createComponent(MobileSpinner);
    fixture.componentRef.setInput("size", 32);
    fixture.componentRef.setInput("color", "neutral");
    fixture.detectChanges();
    expect(fixture.componentInstance.ionColor()).toBe("medium");
    expect(fixture.componentInstance.sizePx()).toBe("32px");
  });
});
