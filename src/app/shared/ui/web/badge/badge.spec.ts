import { TestBed } from "@angular/core/testing";
import { AppBadge } from "./badge";

describe("AppBadge (render)", () => {
  it("renders and maps color to PrimeNG severity", () => {
    TestBed.configureTestingModule({ imports: [AppBadge] });
    const fixture = TestBed.createComponent(AppBadge);
    fixture.componentRef.setInput("value", 3);
    fixture.componentRef.setInput("color", "danger");
    fixture.componentRef.setInput("size", "large");
    fixture.detectChanges();
    expect(fixture.componentInstance.severity()).toBe("danger");
    expect(fixture.componentInstance.badgeSize()).toBe("large");
  });
});
