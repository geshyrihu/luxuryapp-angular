import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputDateSignal } from './custom-input-date-signal';
import { vi } from 'vitest';

describe('CustomInputDateSignal', () => {
  let component: CustomInputDateSignal;
  let fixture: ComponentFixture<CustomInputDateSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputDateSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputDateSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputDateSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values for inputs', () => {
      expect(component.disable()).toEqual([]);
      expect(component.mode()).toBe('single');
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

    describe('writeValue', () => {
      it('should set null/undefined values directly', () => {
        component.writeValue(null);
        expect(component.internalControl.value).toBeNull();
        component.writeValue(undefined);
        expect(component.internalControl.value).toBeUndefined();
      });

      it('should convert ISO date string to Date object', () => {
        component.writeValue('2024-06-15');
        const val = component.internalControl.value;
        expect(val).toBeInstanceOf(Date);
        expect(val.getFullYear()).toBe(2024);
        expect(val.getMonth()).toBe(5);
        expect(val.getDate()).toBe(15);
      });

      it('should pass through existing Date objects', () => {
        const date = new Date(2024, 5, 15);
        component.writeValue(date);
        expect(component.internalControl.value).toBeInstanceOf(Date);
        expect(component.internalControl.value.getTime()).toBe(date.getTime());
      });
    });

    it('setDisabledState should disable/enable control', () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.disabled).toBe(false);
    });
  });
});
