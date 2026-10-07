import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { LuxInputPassword } from "./custom-input-password-signal";

describe("LuxInputPassword", () => {
  let component: LuxInputPassword;
  let fixture: ComponentFixture<LuxInputPassword>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputPassword, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputPassword],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default customClass as empty string", () => {
    expect(component.customClass()).toBe("");
  });

  it("should have default showStrengthIndicator as false", () => {
    expect(component.showStrengthIndicator()).toBe(false);
  });

  it("should have default size as undefined", () => {
    expect(component.size()).toBeUndefined();
  });

  it("should have default promptLabel", () => {
    expect(component.promptLabel()).toBe("Ingresa una contraseña");
  });

  it("should have default weakLabel", () => {
    expect(component.weakLabel()).toBe("Débil");
  });

  it("should have default mediumLabel", () => {
    expect(component.mediumLabel()).toBe("Media");
  });

  it("should have default strongLabel", () => {
    expect(component.strongLabel()).toBe("Fuerte");
  });

  describe("ControlValueAccessor", () => {
    it("should call onChange when registered via registerOnChange", () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange("secret");
      expect(fn).toHaveBeenCalledWith("secret");
    });

    it("should call onTouch when registered via registerOnTouched", () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it("should write value via writeValue", () => {
      const spy = vi.spyOn(component, "writeValue");
      component.writeValue("new password");
      expect(spy).toHaveBeenCalledWith("new password");
    });

    it("should set disabled state via setDisabledState", () => {
      const spy = vi.spyOn(component, "setDisabledState");
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
