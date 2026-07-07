import { TestBed } from "@angular/core/testing";
import { LxBadge } from "./badge";

describe("LxBadge (render)", () => {
  it("renders the platform-selected badge", () => {
    TestBed.configureTestingModule({ imports: [LxBadge] });
    const fixture = TestBed.createComponent(LxBadge);
    fixture.componentRef.setInput("value", 5);
    fixture.componentRef.setInput("color", "primary");
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
