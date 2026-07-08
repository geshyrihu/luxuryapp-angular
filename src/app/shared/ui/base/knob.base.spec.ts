import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { KnobBase } from "./knob.base";

@Component({ selector: "test-knob", template: "" })
class Host extends KnobBase {}

describe("KnobBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
