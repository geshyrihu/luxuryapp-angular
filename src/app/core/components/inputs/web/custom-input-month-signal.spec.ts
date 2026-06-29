import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputMonth } from './custom-input-month-signal';
import { vi } from 'vitest';

describe('CustomInputMonth', () => {
  let component: CustomInputMonth;
  let fixture: ComponentFixture<CustomInputMonth>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputMonth, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputMonth],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputMonth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values for inputs', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('ControlValueAccessor', () => {
    it('should register onChange callback', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('test-value');
      expect(fn).toHaveBeenCalledWith('test-value');
    });

    it('should register onTouched callback', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('writeValue should set control value', () => {
      component.writeValue('new-value');
      expect(component.internalControl.value).toBe('new-value');
    });

    it('setDisabledState should disable/enable control', () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.disabled).toBe(false);
    });
  });
});
