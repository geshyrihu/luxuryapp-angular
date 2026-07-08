import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ProgressBarBase } from "./progress-bar.base";

@Component({ selector: "test-progress-bar", template: "" })
class TestProgressBar extends ProgressBarBase {}

describe("ProgressBarBase", () => {
  function make() {
    return TestBed.createComponent(TestProgressBar);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestProgressBar] });
  });

  it("should create", () => {
    expect(make().componentInstance).toBeTruthy();
  });

  it("clamps value above 100", () => {
    const f = make();
    f.componentRef.setInput("value", 150);
    expect(f.componentInstance.clampedValue()).toBe(100);
  });

  it("clamps value below 0", () => {
    const f = make();
    f.componentRef.setInput("value", -20);
    expect(f.componentInstance.clampedValue()).toBe(0);
  });

  it("fraction converts percentage to 0..1", () => {
    const f = make();
    f.componentRef.setInput("value", 50);
    expect(f.componentInstance.fraction()).toBe(0.5);
  });
});
