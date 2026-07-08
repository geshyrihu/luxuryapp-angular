import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SpinnerBase } from "./spinner.base";

@Component({ selector: "test-spinner", template: "" })
class TestSpinner extends SpinnerBase {}

describe("SpinnerBase", () => {
  function make() {
    return TestBed.createComponent(TestSpinner);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestSpinner] });
  });

  it("should create", () => {
    expect(make().componentInstance).toBeTruthy();
  });

  it("sizePx appends px", () => {
    const f = make();
    f.componentRef.setInput("size", 64);
    expect(f.componentInstance.sizePx()).toBe("64px");
  });

  it("defaults size to 40px and color to primary", () => {
    const c = make().componentInstance;
    expect(c.sizePx()).toBe("40px");
    expect(c.color()).toBe("primary");
  });
});
