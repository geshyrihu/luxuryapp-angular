import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputUrl } from "./lux-input-url-signal";

describe("LuxInputUrl", () => {
  let component: LuxInputUrl;
  let fixture: ComponentFixture<LuxInputUrl>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputUrl, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputUrl],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputUrl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default customClass as empty string", () => {
    expect(component.customClass()).toBe("");
  });

  it("should set customClass via input", () => {
    fixture.componentRef.setInput("customClass", "url-class");
    fixture.detectChanges();
    expect(component.customClass()).toBe("url-class");
  });

  describe("ControlValueAccessor", () => {
    it("should call onChange when registered via registerOnChange", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange("https://example.com");
      expect(fn).toHaveBeenCalledWith("https://example.com");
    });

    it("should call onTouch when registered via registerOnTouched", () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it("should write value via writeValue", () => {
      const spy = vi.spyOn(component, "writeValue");
      component.writeValue("https://test.com");
      expect(spy).toHaveBeenCalledWith("https://test.com");
    });

    it("should set disabled state via setDisabledState", () => {
      const spy = vi.spyOn(component, "setDisabledState");
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
