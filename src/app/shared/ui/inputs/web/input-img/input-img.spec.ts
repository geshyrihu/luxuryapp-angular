import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";
import { WebInputImg } from "./input-img";

vi.mock("../custom-input-img-signal", () => ({
  LuxInputImg: class {},
}));

describe("WebInputImg", () => {
  let component: WebInputImg;
  let fixture: ComponentFixture<WebInputImg>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputImg, {
      set: { template: "<div>Mock</div>", imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputImg],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputImg);
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
