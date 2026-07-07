import { TestBed } from "@angular/core/testing";
import { MobilePaginator } from "./paginator";

describe("MobilePaginator (render)", () => {
  it("renders with page info", () => {
    TestBed.configureTestingModule({ imports: [MobilePaginator] });
    const fixture = TestBed.createComponent(MobilePaginator);
    fixture.componentRef.setInput("totalRecords", 100);
    fixture.componentRef.setInput("rows", 20);
    fixture.detectChanges();
    expect(fixture.componentInstance.totalPages()).toBe(5);
  });
});
