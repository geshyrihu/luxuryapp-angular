import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TreeTableBase } from "./tree-table.base";

@Component({ selector: "test-tree-table", template: "" })
class TestTreeTable extends TreeTableBase {}

describe("TreeTableBase", () => {
  function make() {
    return TestBed.createComponent(TestTreeTable);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTreeTable] });
  });

  it("should create", () => {
    const f = make();
    f.componentRef.setInput("nodes", []);
    f.componentRef.setInput("columns", []);
    expect(f.componentInstance).toBeTruthy();
  });
});
