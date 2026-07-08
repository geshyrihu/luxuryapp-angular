import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { MeterGroupBase } from "./meter-group.base";

@Component({ selector: "test-meter-group", standalone: true, template: "" })
class Host extends MeterGroupBase {}

describe("MeterGroupBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
