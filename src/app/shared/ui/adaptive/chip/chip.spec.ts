import { TestBed } from "@angular/core/testing";
import { LxChip } from "./chip";

describe("LxChip (render)", () => {
  it("renders the platform-selected chip", () => {
    TestBed.configureTestingModule({ imports: [LxChip] });
    const fixture = TestBed.createComponent(LxChip);
    fixture.componentRef.setInput("label", "Adaptive");
    fixture.componentRef.setInput("removable", true);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
