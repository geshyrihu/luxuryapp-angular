import { TestBed } from "@angular/core/testing";
import { AppBadge } from "./badge";

describe("AppBadge (render)", () => {
  it("renders and exposes color/size inputs", () => {
    TestBed.configureTestingModule({ imports: [AppBadge] });
    const fixture = TestBed.createComponent(AppBadge);
    fixture.componentRef.setInput("value", 3);
    fixture.componentRef.setInput("color", "danger");
    fixture.componentRef.setInput("size", "large");
    fixture.detectChanges();
    expect(fixture.componentInstance.color()).toBe("danger");
    expect(fixture.componentInstance.size()).toBe("large");
    expect(fixture.componentInstance.displayValue()).toBe("3");
    expect(fixture.componentInstance.ionColor()).toBe("danger");
  });
});
