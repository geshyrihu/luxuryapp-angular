import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputAutoMultiple } from './custom-input-autocomplete-multiple-signal';
import { vi } from 'vitest';

describe('CustomInputAutoMultiple', () => {
  let component: CustomInputAutoMultiple;
  let fixture: ComponentFixture<CustomInputAutoMultiple>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputAutoMultiple, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputAutoMultiple],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputAutoMultiple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signal defaults', () => {
    it('should have default values for inputs', () => {
      expect(component.data()).toEqual([]);
      expect(component.size()).toBeUndefined();
    });

    it('should initialize filteredData as empty array', () => {
      expect(component.filteredData).toEqual([]);
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

  describe('search', () => {
    it('should filter data based on query', () => {
      fixture.componentRef.setInput('data', [
        { label: 'Apple', value: 1 },
        { label: 'Banana', value: 2 },
        { label: 'Apricot', value: 3 },
      ]);
      component.search({ query: 'ap' });
      expect(component.filteredData).toEqual([
        { label: 'Apple', value: 1 },
        { label: 'Apricot', value: 3 },
      ]);
    });

    it('should return empty array when no match', () => {
      fixture.componentRef.setInput('data', [
        { label: 'Apple', value: 1 },
      ]);
      component.search({ query: 'xyz' });
      expect(component.filteredData).toEqual([]);
    });
  });

  describe('output propagar', () => {
    it('should emit on model change', () => {
      const spy = vi.spyOn(component.propagar, 'emit');
      component.onModelChange([{ label: 'A', value: 1 }, { label: 'B', value: 2 }]);
      expect(spy).toHaveBeenCalledWith([1, 2]);
    });

    it('should emit on select item', () => {
      const spy = vi.spyOn(component.propagar, 'emit');
      component.onSelectItem({ value: { label: 'A', value: 1 } });
      expect(spy).toHaveBeenCalledWith([1]);
    });

    it('should emit on unselect item', () => {
      const ctrl = component.control() || component.internalControl;
      ctrl.setValue([{ label: 'A', value: 1 }, { label: 'B', value: 2 }]);
      const spy = vi.spyOn(component.propagar, 'emit');
      component.onUnselectItem({ value: { label: 'A', value: 1 } });
      expect(spy).toHaveBeenCalledWith([2]);
    });

    it('should emit empty array on clear', () => {
      const spy = vi.spyOn(component.propagar, 'emit');
      component.onClear();
      expect(spy).toHaveBeenCalledWith([]);
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
