import { TestBed } from "@angular/core/testing";
import { SegmentedControl } from "./segmented-control";

describe("SegmentedControl", () => {
  it("should create", () => {
    const fixture = TestBed.createComponent(SegmentedControl);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should update value and emit on select", () => {
    const fixture = TestBed.createComponent(SegmentedControl);
    const component = fixture.componentInstance;
    let emitted = "";
    component.changed.subscribe((v) => (emitted = v));

    component.select("b");

    expect(component.value()).toBe("b");
    expect(emitted).toBe("b");
  });
});
