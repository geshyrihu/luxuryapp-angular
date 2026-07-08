import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { DateRangeBase } from "./date-range.base";

@Component({ selector: "test-date-range", standalone: true, template: "" })
class Host extends DateRangeBase {}

describe("DateRangeBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
