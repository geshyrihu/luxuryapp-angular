import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputNgSelect } from './custom-input-ng-select-signal';
import { vi } from 'vitest';

describe('CustomInputNgSelect', () => {
  let component: CustomInputNgSelect;
  let fixture: ComponentFixture<CustomInputNgSelect>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputNgSelect, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputNgSelect],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputNgSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values for inputs', () => {
      expect(component.items()).toEqual([]);
      expect(component.bindLabel()).toBe('label');
      expect(component.bindValue()).toBe('value');
      expect(component.clearable()).toBe(true);
      expect(component.searchable()).toBe(true);
      expect(component.customClass()).toBe('');
      expect(component.size()).toBeUndefined();
    });
  });

  describe('getSizeClass computed', () => {
    it('should return empty string when no size or customClass', () => {
      expect(component.getSizeClass()).toBe('');
    });

    it('should include p-inputtext-sm when size is small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.getSizeClass()).toBe('p-inputtext-sm');
    });

    it('should include p-inputtext-lg when size is large', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.getSizeClass()).toBe('p-inputtext-lg');
    });

    it('should prepend customClass when provided', () => {
      fixture.componentRef.setInput('customClass', 'my-class');
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.getSizeClass()).toBe('my-class p-inputtext-sm');
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
