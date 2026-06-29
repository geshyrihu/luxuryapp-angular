import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputHour } from './custom-input-hour-signal';
import { vi } from 'vitest';

describe('CustomInputHour', () => {
  let component: CustomInputHour;
  let fixture: ComponentFixture<CustomInputHour>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputHour, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputHour],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputHour);
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

  describe('handleFlatpickrChange', () => {
    it('should call onChange and onTouch with the date string', () => {
      const onChangeSpy = vi.spyOn(component, 'onChange');
      const onTouchSpy = vi.spyOn(component, 'onTouch');
      component.handleFlatpickrChange('14:30');
      expect(onChangeSpy).toHaveBeenCalledWith('14:30');
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
