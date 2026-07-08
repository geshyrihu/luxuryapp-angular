import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BadgeBase } from "./badge.base";

@Component({ selector: "test-badge", template: "" })
class TestBadge extends BadgeBase {}

describe("BadgeBase", () => {
  function make() {
    const fixture = TestBed.createComponent(TestBadge);
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestBadge] });
  });

  it("should create", () => {
    expect(make().componentInstance).toBeTruthy();
  });

  it("displayValue stringifies numeric value", () => {
    const f = make();
    f.componentRef.setInput("value", 7);
    expect(f.componentInstance.displayValue()).toBe("7");
  });

  it("displayValue is empty for empty string", () => {
    expect(make().componentInstance.displayValue()).toBe("");
  });

  it("ionColor maps danger to danger and neutral to medium", () => {
    const f = make();
    f.componentRef.setInput("color", "danger");
    expect(f.componentInstance.ionColor()).toBe("danger");
    f.componentRef.setInput("color", "neutral");
    expect(f.componentInstance.ionColor()).toBe("medium");
  });

  it("ionColor maps info to tertiary", () => {
    const f = make();
    f.componentRef.setInput("color", "info");
    expect(f.componentInstance.ionColor()).toBe("tertiary");
  });
});
