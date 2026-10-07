import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputSwitch } from "./lux-input-switch-signal";

describe("LuxInputSwitch", () => {
  let component: LuxInputSwitch;
  let fixture: ComponentFixture<LuxInputSwitch>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputSwitch, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputSwitch],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have switchChange defined as output", () => {
    expect(component.switchChange).toBeDefined();
  });

  describe("switchChange output", () => {
    it("should emit true when onValueChange is called with checked event", () => {
      const emitSpy = vi.fn();
      component.switchChange.subscribe(emitSpy);

      const event = { target: { checked: true } } as unknown as Event;
      component.onValueChange(event);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it("should emit false when onValueChange is called with unchecked event", () => {
      const emitSpy = vi.fn();
      component.switchChange.subscribe(emitSpy);

      const event = { target: { checked: false } } as unknown as Event;
      component.onValueChange(event);

      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe("ControlValueAccessor", () => {
    it("should call onChange when registered via registerOnChange", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange(true);
      expect(fn).toHaveBeenCalledWith(true);
    });

    it("should call onTouch when registered via registerOnTouched", () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it("should write value via writeValue", () => {
      const spy = vi.spyOn(component, "writeValue");
      component.writeValue(true);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it("should set disabled state via setDisabledState", () => {
      const spy = vi.spyOn(component, "setDisabledState");
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
