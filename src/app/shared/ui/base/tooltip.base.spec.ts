import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TooltipBase } from "./tooltip.base";

@Component({ selector: "test-tooltip", template: "" })
class Host extends TooltipBase {}

describe("TooltipBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
