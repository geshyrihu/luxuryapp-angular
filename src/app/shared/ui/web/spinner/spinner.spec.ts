import { TestBed } from "@angular/core/testing";
import { AppSpinner } from "./spinner";

describe("AppSpinner (render)", () => {
  it("renders with size and color", () => {
    TestBed.configureTestingModule({ imports: [AppSpinner] });
    const fixture = TestBed.createComponent(AppSpinner);
    fixture.componentRef.setInput("size", 48);
    fixture.componentRef.setInput("color", "danger");
    fixture.detectChanges();
    expect(fixture.componentInstance.sizePx()).toBe("48px");
  });
});
