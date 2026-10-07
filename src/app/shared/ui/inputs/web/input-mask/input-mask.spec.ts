import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { WebInputMask } from "./input-mask";

vi.mock("../lux-input-mask-signal", () => ({
  LuxInputMaskSignal: class {},
}));

describe("WebInputMask", () => {
  let component: WebInputMask;
  let fixture: ComponentFixture<WebInputMask>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputMask, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputMask],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputMask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should register onChange callback", () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange("test");
    expect(fn).toHaveBeenCalledWith("test");
  });

  it("should register onTouched callback", () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
