import { TestBed } from "@angular/core/testing";
import { LxTable } from "./table";

describe("LxTable (render)", () => {
  it("renders the platform-selected table", () => {
    TestBed.configureTestingModule({ imports: [LxTable] });
    const fixture = TestBed.createComponent(LxTable);
    fixture.componentRef.setInput("columns", []);
    fixture.componentRef.setInput("data", []);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
