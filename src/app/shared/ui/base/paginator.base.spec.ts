import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { PaginatorBase } from "./paginator.base";

@Component({ selector: "test-paginator", standalone: true, template: "" })
class TestPaginator extends PaginatorBase {}

describe("PaginatorBase", () => {
  function make() {
    return TestBed.createComponent(TestPaginator);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPaginator] });
  });

  it("should create", () => {
    expect(make().componentInstance).toBeTruthy();
  });

  it("computes total pages", () => {
    const f = make();
    f.componentRef.setInput("totalRecords", 100);
    f.componentRef.setInput("rows", 20);
    expect(f.componentInstance.totalPages()).toBe(5);
  });

  it("detects first page", () => {
    const f = make();
    expect(f.componentInstance.isFirstPage()).toBeTrue();
  });

  it("detects last page", () => {
    const f = make();
    f.componentRef.setInput("totalRecords", 100);
    f.componentRef.setInput("rows", 20);
    f.componentInstance.page.set(4);
    expect(f.componentInstance.isLastPage()).toBeTrue();
  });

  it("clamps page on page change", () => {
    const f = make();
    f.componentRef.setInput("totalRecords", 100);
    f.componentRef.setInput("rows", 20);
    f.componentInstance.onPageChange(10);
    expect(f.componentInstance.page()).toBe(0);
  });

  it("resets page on rows change", () => {
    const f = make();
    f.componentInstance.page.set(3);
    f.componentInstance.onRowsChange(50);
    expect(f.componentInstance.page()).toBe(0);
  });
});
