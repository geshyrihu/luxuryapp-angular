import { TestBed } from "@angular/core/testing";
import { MobileChip } from "./chip";

describe("MobileChip (render)", () => {
  it("renders with label and maps color to Ionic palette", () => {
    TestBed.configureTestingModule({ imports: [MobileChip] });
    const fixture = TestBed.createComponent(MobileChip);
    fixture.componentRef.setInput("label", "Etiqueta");
    fixture.componentRef.setInput("removable", true);
    fixture.componentRef.setInput("color", "neutral");
    fixture.detectChanges();
    expect(fixture.componentInstance.ionColor()).toBe("medium");
  });
});
