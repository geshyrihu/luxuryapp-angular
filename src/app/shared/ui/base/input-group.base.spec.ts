import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { InputGroupBase } from "./input-group.base";

@Component({ selector: "test-input-group", template: "" })
class Host extends InputGroupBase {}

describe("InputGroupBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
