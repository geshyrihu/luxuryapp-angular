import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputCheckSignal } from "./custom-input-check-signal";

describe("LuxInputCheckSignal", () => {
  let component: LuxInputCheckSignal;
  let fixture: ComponentFixture<LuxInputCheckSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputCheckSignal, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputCheckSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputCheckSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("outputs", () => {
    it("should emit checkChange output with boolean value", () => {
      const spy = vi.fn();
      component.checkChange.subscribe(spy);
      component.checkChange.emit(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe("ControlValueAccessor", () => {
    it("should implement registerOnChange", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange("test");
      expect(fn).toHaveBeenCalledWith("test");
    });

    it("should implement registerOnTouched", () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it("should implement writeValue", () => {
      component.writeValue(true);
      expect(component.internalControl.value).toBe(true);
    });

    it("should implement setDisabledState", () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.enabled).toBe(true);
    });
  });
});
