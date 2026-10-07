import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LuxInputToggleSwitch } from "./lux-input-toggle-switch-signal";

describe("LuxInputToggleSwitch", () => {
  let component: LuxInputToggleSwitch;
  let fixture: ComponentFixture<LuxInputToggleSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxInputToggleSwitch],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LuxInputToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
