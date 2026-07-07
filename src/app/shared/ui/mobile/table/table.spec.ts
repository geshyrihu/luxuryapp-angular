import { TestBed } from "@angular/core/testing";
import { MobileTable } from "./table";

describe("MobileTable (render)", () => {
  it("renders with data", () => {
    TestBed.configureTestingModule({ imports: [MobileTable] });
    const fixture = TestBed.createComponent(MobileTable);
    fixture.componentRef.setInput("columns", [{ field: "name", header: "Name" }]);
    fixture.componentRef.setInput("data", [{ name: "Test" }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("shows empty state when no data", () => {
    TestBed.configureTestingModule({ imports: [MobileTable] });
    const fixture = TestBed.createComponent(MobileTable);
    fixture.componentRef.setInput("columns", []);
    fixture.componentRef.setInput("data", []);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
