import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LuxInputSelectBool } from "./lux-input-select-bool-signal";

describe("LuxInputSelectBool", () => {
  let component: LuxInputSelectBool;
  let fixture: ComponentFixture<LuxInputSelectBool>;

  beforeEach(() => {
    TestBed.overrideComponent(LuxInputSelectBool, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [LuxInputSelectBool],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(LuxInputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("default signal values", () => {
    it('should have default activeLabel as "Activo"', () => {
      expect(component.activeLabel()).toBe("Activo");
    });

    it('should have default inactiveLabel as "Inactivo"', () => {
      expect(component.inactiveLabel()).toBe("Inactivo");
    });

    it("should have default showClear as true", () => {
      expect(component.showClear()).toBe(true);
    });

    it("should have default size as undefined", () => {
      expect(component.size()).toBeUndefined();
    });
  });
});
