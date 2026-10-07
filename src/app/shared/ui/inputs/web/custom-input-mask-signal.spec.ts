import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LuxInputMaskSignal } from "./custom-input-mask-signal";

describe("LuxInputMaskSignal", () => {
  let component: LuxInputMaskSignal;
  let fixture: ComponentFixture<LuxInputMaskSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputMaskSignal, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputMaskSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputMaskSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("default signal values", () => {
    it("should have default size as undefined", () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe("required inputs", () => {
    it("should accept customMask input", () => {
      fixture.componentRef.setInput("customMask", "000-000-0000");
      fixture.detectChanges();
      expect(component.customMask()).toBe("000-000-0000");
    });
  });
});
