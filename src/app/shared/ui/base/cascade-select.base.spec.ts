import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { CascadeSelectBase } from "./cascade-select.base";

@Component({ selector: "test-cascade-select", standalone: true, template: "" })
class Host extends CascadeSelectBase {}

describe("CascadeSelectBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
