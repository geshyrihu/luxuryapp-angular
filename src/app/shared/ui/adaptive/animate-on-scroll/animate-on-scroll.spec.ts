import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LxAnimateOnScroll } from "./animate-on-scroll";

@Component({
  selector: "host-animate-on-scroll",

  imports: [LxAnimateOnScroll],
  template: `<div lxAnimateOnScroll></div>`,
})
class Host {}

describe("LxAnimateOnScroll (directive)", () => {
  it("applies to a host element and compiles", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div")).toBeTruthy();
  });
});
