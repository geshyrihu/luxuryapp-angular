import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SliderBase } from "./slider.base";

@Component({ selector: "test-slider", template: "" })
class Host extends SliderBase {}

describe("SliderBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
