import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TreeBase } from "./tree.base";

@Component({ selector: "test-tree", template: "" })
class Host extends TreeBase {}

describe("TreeBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
