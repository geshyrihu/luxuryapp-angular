import { TestBed } from "@angular/core/testing";
import { MobileBadge } from "./badge";

describe("MobileBadge (render)", () => {
  it("renders value with Ionic color", () => {
    TestBed.configureTestingModule({ imports: [MobileBadge] });
    const fixture = TestBed.createComponent(MobileBadge);
    fixture.componentRef.setInput("value", 9);
    fixture.componentRef.setInput("color", "success");
    fixture.detectChanges();
    expect(fixture.componentInstance.ionColor()).toBe("success");
    expect(fixture.componentInstance.displayValue()).toBe("9");
  });
});
