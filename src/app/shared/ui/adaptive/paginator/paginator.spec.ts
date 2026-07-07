import { TestBed } from "@angular/core/testing";
import { LxPaginator } from "./paginator";

describe("LxPaginator (render)", () => {
  it("renders the platform-selected paginator", () => {
    TestBed.configureTestingModule({ imports: [LxPaginator] });
    const fixture = TestBed.createComponent(LxPaginator);
    fixture.componentRef.setInput("totalRecords", 100);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
