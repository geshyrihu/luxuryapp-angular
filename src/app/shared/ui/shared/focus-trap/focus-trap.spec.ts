import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FocusTrap } from "./focus-trap";

@Component({
  selector: "host-focus-trap",
  standalone: true,
  imports: [FocusTrap],
  template: `<div appFocusTrap tabindex="0"></div>`,
})
class Host {}

describe("FocusTrap (directive)", () => {
  it("applies to a host element and compiles", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("div")).toBeTruthy();
  });
});
