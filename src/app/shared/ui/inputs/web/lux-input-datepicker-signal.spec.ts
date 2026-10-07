import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlatpickrDefaults } from "angularx-flatpickr";
import { LuxInputDatepicker } from "./custom-input-datepicker-signal";

describe("LuxInputDatepicker", () => {
  let component: LuxInputDatepicker;
  let fixture: ComponentFixture<LuxInputDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxInputDatepicker],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FlatpickrDefaults, useClass: FlatpickrDefaults }],
    });
    TestBed.overrideComponent(LuxInputDatepicker, {
      set: { template: "<div></div>", imports: [] },
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(LuxInputDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
