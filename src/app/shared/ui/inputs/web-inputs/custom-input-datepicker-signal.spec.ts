import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputDatepicker } from './custom-input-datepicker-signal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomInputDatepicker', () => {
  let component: CustomInputDatepicker;
  let fixture: ComponentFixture<CustomInputDatepicker>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputDatepicker, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [CustomInputDatepicker, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomInputDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
