import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TableBase } from "./table.base";

@Component({ selector: "test-table", standalone: true, template: "" })
class TestTable extends TableBase {}

describe("TableBase", () => {
  function make() {
    return TestBed.createComponent(TestTable);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTable] });
  });

  it("should create", () => {
    const f = make();
    f.componentRef.setInput("columns", []);
    f.componentRef.setInput("data", []);
    expect(f.componentInstance).toBeTruthy();
  });

  it("accepts column definitions", () => {
    const f = make();
    f.componentRef.setInput("columns", [{ field: "name", header: "Name" }]);
    f.componentRef.setInput("data", []);
    expect(f.componentInstance.columns().length).toBe(1);
  });
});
