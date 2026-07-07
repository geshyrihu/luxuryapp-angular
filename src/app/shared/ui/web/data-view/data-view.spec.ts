import { TestBed } from "@angular/core/testing";
import { DataView } from "./data-view";

describe("DataView (render)", () => {
  it("renders with data", () => {
    TestBed.configureTestingModule({ imports: [DataView] });
    const fixture = TestBed.createComponent(DataView);
    fixture.componentRef.setInput("data", [{ name: "Item 1" }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("shows empty state when no data", () => {
    TestBed.configureTestingModule({ imports: [DataView] });
    const fixture = TestBed.createComponent(DataView);
    fixture.componentRef.setInput("data", []);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
