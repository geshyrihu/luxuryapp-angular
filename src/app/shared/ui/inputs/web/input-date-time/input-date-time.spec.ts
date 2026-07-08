import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputDateTime } from './input-date-time';
import { vi } from 'vitest';

vi.mock('../custom-input-date-time-signal', () => ({
  CustomInputDateTimeSignal: class {},
}));

describe('WebInputDateTime', () => {
  let component: WebInputDateTime;
  let fixture: ComponentFixture<WebInputDateTime>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputDateTime, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputDateTime],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputDateTime);
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
