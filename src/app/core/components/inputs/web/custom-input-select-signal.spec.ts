import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSelectSignal } from './custom-input-select-signal';
import { vi } from 'vitest';

describe('CustomInputSelectSignal', () => {
  let component: CustomInputSelectSignal;
  let fixture: ComponentFixture<CustomInputSelectSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSelectSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputSelectSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputSelectSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default data as empty array', () => {
      expect(component.data()).toEqual([]);
    });

    it('should have default valueDefault as null', () => {
      expect(component.valueDefault()).toBeNull();
    });

    it('should have default showClear as true', () => {
      expect(component.showClear()).toBe(true);
    });

    it('should have default filter as false', () => {
      expect(component.filter()).toBe(false);
    });

    it('should have default loading as false', () => {
      expect(component.loading()).toBe(false);
    });

    it('should have default filterBy as "label"', () => {
      expect(component.filterBy()).toBe('label');
    });

    it('should have default optionLabel as "label"', () => {
      expect(component.optionLabel()).toBe('label');
    });

    it('should have default optionValue as "value"', () => {
      expect(component.optionValue()).toBe('value');
    });

    it('should have default customClass as empty string', () => {
      expect(component.customClass()).toBe('');
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('outputs', () => {
    it('should emit selectionChange output', () => {
      const spy = vi.fn();
      component.selectionChange.subscribe(spy);
      component.selectionChange.emit({ value: 1 });
      expect(spy).toHaveBeenCalledWith({ value: 1 });
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement registerOnChange', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('test');
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('should implement registerOnTouched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('should implement writeValue', () => {
      component.writeValue('test-value');
      expect(component.internalControl.value).toBe('test-value');
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.enabled).toBe(true);
    });
  });
});
