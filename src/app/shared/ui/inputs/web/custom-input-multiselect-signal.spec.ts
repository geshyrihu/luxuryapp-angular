import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputMultiselectSignal } from "./custom-input-multiselect-signal";

describe("LuxInputMultiselectSignal", () => {
  let component: LuxInputMultiselectSignal;
  let fixture: ComponentFixture<LuxInputMultiselectSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputMultiselectSignal, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputMultiselectSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputMultiselectSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("signal defaults", () => {
    it("should have default values for inputs", () => {
      expect(component.options()).toEqual([]);
      expect(component.optionLabel()).toBe("label");
      expect(component.optionValue()).toBe("value");
      expect(component.group()).toBe(false);
      expect(component.optionGroupLabel()).toBe("label");
      expect(component.optionGroupChildren()).toBe("items");
      expect(component.filter()).toBe(true);
      expect(component.showClear()).toBe(true);
      expect(component.size()).toBeUndefined();
      expect(component.scrollHeight()).toBe("350px");
      expect(component.panelStyle()).toEqual({ "min-width": "20rem" });
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
