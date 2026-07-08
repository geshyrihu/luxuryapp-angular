import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ColorPickerBase } from "./color-picker.base";

@Component({ selector: "test-color-picker", standalone: true, template: "" })
class Host extends ColorPickerBase {}

describe("ColorPickerBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
