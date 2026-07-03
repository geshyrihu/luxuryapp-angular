import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputMultiselectSignal } from './custom-input-multiselect-signal';
import { vi } from 'vitest';

describe('CustomInputMultiselectSignal', () => {
  let component: CustomInputMultiselectSignal;
  let fixture: ComponentFixture<CustomInputMultiselectSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputMultiselectSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputMultiselectSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputMultiselectSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values for inputs', () => {
      expect(component.options()).toEqual([]);
      expect(component.optionLabel()).toBe('label');
      expect(component.optionValue()).toBe('value');
      expect(component.group()).toBe(false);
      expect(component.optionGroupLabel()).toBe('label');
      expect(component.optionGroupChildren()).toBe('items');
      expect(component.filter()).toBe(true);
      expect(component.showClear()).toBe(true);
      expect(component.size()).toBeUndefined();
      expect(component.scrollHeight()).toBe('350px');
      expect(component.panelStyle()).toEqual({ 'min-width': '20rem' });
    });
  });

  describe('getSizeClass', () => {
    it('should return empty string when no size', () => {
      expect(component.getSizeClass()).toBe('');
    });

    it('should return p-inputtext-sm when size is small', () => {
      fixture.componentRef.setInput('size', 'small');
      expect(component.getSizeClass()).toBe('p-inputtext-sm');
    });

    it('should return p-inputtext-lg when size is large', () => {
      fixture.componentRef.setInput('size', 'large');
      expect(component.getSizeClass()).toBe('p-inputtext-lg');
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
