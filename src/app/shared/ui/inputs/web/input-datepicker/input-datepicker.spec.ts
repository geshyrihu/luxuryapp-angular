import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputDatepicker } from './input-datepicker';
import { vi } from 'vitest';

vi.mock('../custom-input-datepicker-signal', () => ({
  CustomInputDatepicker: class {},
}));

describe('WebInputDatepicker', () => {
  let component: WebInputDatepicker;
  let fixture: ComponentFixture<WebInputDatepicker>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputDatepicker, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputDatepicker],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputDatepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register onChange callback', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('test');
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
