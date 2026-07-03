import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputDateTimeSignal } from './custom-input-date-time-signal';
import { vi } from 'vitest';

describe('CustomInputDateTimeSignal', () => {
  let component: CustomInputDateTimeSignal;
  let fixture: ComponentFixture<CustomInputDateTimeSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputDateTimeSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputDateTimeSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputDateTimeSignal);
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

  describe('handleDateChange', () => {
    it('should call onChange and onTouch with the date value', () => {
      const onChangeSpy = vi.spyOn(component, 'onChange');
      const onTouchSpy = vi.spyOn(component, 'onTouch');
      const date = new Date(2024, 5, 15, 10, 30);
      component.handleDateChange(date);
      expect(onChangeSpy).toHaveBeenCalledWith(date);
      expect(onTouchSpy).toHaveBeenCalled();
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
