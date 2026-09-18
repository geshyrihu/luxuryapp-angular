import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { CustomInputDatepicker } from './custom-input-datepicker-signal';

describe('CustomInputDatepicker', () => {
  let component: CustomInputDatepicker;
  let fixture: ComponentFixture<CustomInputDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputDatepicker],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: FlatpickrDefaults, useClass: FlatpickrDefaults }],
    });
    TestBed.overrideComponent(CustomInputDatepicker, { set: { template: '<div></div>', imports: [] } });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(CustomInputDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
