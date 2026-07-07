import { TestBed } from "@angular/core/testing";
import { AppChip } from "./chip";

describe("AppChip (render)", () => {
  it("renders with label, icon and removable", () => {
    TestBed.configureTestingModule({ imports: [AppChip] });
    const fixture = TestBed.createComponent(AppChip);
    fixture.componentRef.setInput("label", "Etiqueta");
    fixture.componentRef.setInput("icon", "mdi:tag");
    fixture.componentRef.setInput("removable", true);
    fixture.componentRef.setInput("color", "success");
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.chipClass()).toContain("app-chip-success");
  });
});
