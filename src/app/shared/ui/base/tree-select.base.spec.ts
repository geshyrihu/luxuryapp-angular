import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TreeSelectBase } from "./tree-select.base";

@Component({ selector: "test-tree-select", standalone: true, template: "" })
class Host extends TreeSelectBase {}

describe("TreeSelectBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
