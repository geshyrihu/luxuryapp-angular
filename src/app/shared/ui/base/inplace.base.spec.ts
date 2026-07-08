import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { InplaceBase } from "./inplace.base";

@Component({ selector: "test-inplace", standalone: true, template: "" })
class Host extends InplaceBase {}

describe("InplaceBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
