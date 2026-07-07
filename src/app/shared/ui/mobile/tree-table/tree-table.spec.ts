import { TestBed } from "@angular/core/testing";
import { MobileTreeTable } from "./tree-table";

describe("MobileTreeTable (render)", () => {
  it("renders with nodes", () => {
    TestBed.configureTestingModule({ imports: [MobileTreeTable] });
    const fixture = TestBed.createComponent(MobileTreeTable);
    fixture.componentRef.setInput("nodes", [{ label: "Root", children: [] }]);
    fixture.componentRef.setInput("columns", [{ field: "name", header: "Name" }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
