import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LxTooltip } from "./tooltip";

@Component({
  selector: "host-tooltip",

  imports: [LxTooltip],
  template: `<div lxTooltip></div>`,
})
class Host {}

describe("LxTooltip (directive)", () => {
  it("applies to a host element and compiles", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div")).toBeTruthy();
  });
});
