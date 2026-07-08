import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WebInputMonth } from './input-month';
import { vi } from 'vitest';

vi.mock('../custom-input-month-signal', () => ({
  CustomInputMonth: class {},
}));

describe('WebInputMonth', () => {
  let component: WebInputMonth;
  let fixture: ComponentFixture<WebInputMonth>;

  beforeEach(() => {
    TestBed.overrideComponent(WebInputMonth, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [WebInputMonth],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(WebInputMonth);
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
