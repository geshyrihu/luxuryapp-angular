import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputMonth } from "./custom-input-month-signal";

describe("LuxInputMonth", () => {
  let component: LuxInputMonth;
  let fixture: ComponentFixture<LuxInputMonth>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputMonth, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputMonth],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputMonth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("signal defaults", () => {
    it("should have default values for inputs", () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe("ControlValueAccessor", () => {
    it("should register onChange callback", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange("test-value");
      expect(fn).toHaveBeenCalledWith("test-value");
    });

    it("should register onTouched callback", () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it("writeValue should set control value", () => {
      component.writeValue("new-value");
      expect(component.internalControl.value).toBe("new-value");
    });

    it("setDisabledState should disable/enable control", () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.disabled).toBe(false);
    });
  });
});
