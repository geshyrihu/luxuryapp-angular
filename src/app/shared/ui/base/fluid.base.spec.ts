import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FluidBase } from "./fluid.base";

@Component({ selector: "test-fluid", standalone: true, template: "" })
class Host extends FluidBase {}

describe("FluidBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
