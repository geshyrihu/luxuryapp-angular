import { TestBed } from "@angular/core/testing";
import { LxTreeTable } from "./tree-table";

describe("LxTreeTable (render)", () => {
  it("renders the platform-selected tree table", () => {
    TestBed.configureTestingModule({ imports: [LxTreeTable] });
    const fixture = TestBed.createComponent(LxTreeTable);
    fixture.componentRef.setInput("nodes", []);
    fixture.componentRef.setInput("columns", []);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
