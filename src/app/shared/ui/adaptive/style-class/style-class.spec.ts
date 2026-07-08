import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LxStyleClass } from "./style-class";

@Component({
  selector: "host-style-class",

  imports: [LxStyleClass],
  template: `<div lxStyleClass></div>`,
})
class Host {}

describe("LxStyleClass (directive)", () => {
  it("applies to a host element and compiles", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div")).toBeTruthy();
  });
});
