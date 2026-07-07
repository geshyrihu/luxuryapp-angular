import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ChipBase } from "./chip.base";

@Component({
  selector: "test-chip",
  standalone: true,
  template: "",
})
class TestChip extends ChipBase {}

describe("ChipBase", () => {
  let component: TestChip;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestChip] });
    const fixture = TestBed.createComponent(TestChip);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit removed when not disabled", () => {
    const spy = vi.fn();
    component.removed.subscribe(spy);
    component.onRemove();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should not emit removed when disabled", () => {
    const fixture = TestBed.createComponent(TestChip);
    fixture.componentRef.setInput("disabled", true);
    const spy = vi.fn();
    fixture.componentInstance.removed.subscribe(spy);
    fixture.componentInstance.onRemove();
    expect(spy).not.toHaveBeenCalled();
  });

  it("should emit chipClick only when clickable", () => {
    const fixture = TestBed.createComponent(TestChip);
    const spy = vi.fn();
    fixture.componentInstance.chipClick.subscribe(spy);

    fixture.componentInstance.onClick();
    expect(spy).not.toHaveBeenCalled();

    fixture.componentRef.setInput("clickable", true);
    fixture.componentInstance.onClick();
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should default color to neutral", () => {
    expect(component.color()).toBe("neutral");
  });
});
