import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSelectPrefix } from './custom-input-select-prefix-signal';
import { vi } from 'vitest';

describe('CustomInputSelectPrefix', () => {
  let component: CustomInputSelectPrefix;
  let fixture: ComponentFixture<CustomInputSelectPrefix>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSelectPrefix, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputSelectPrefix],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputSelectPrefix);
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

    it('should have default selectPlaceholder as "Seleccionar"', () => {
      expect(component.selectPlaceholder()).toBe('Seleccionar');
    });

    it('should have default inputPlaceholder as empty string', () => {
      expect(component.inputPlaceholder()).toBe('');
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('computed properties', () => {
    it('should compute selectOptions as empty array when data is empty', () => {
      expect(component.selectOptions()).toEqual([]);
    });

    it('should compute selectOptions from string array data', () => {
      fixture.componentRef.setInput('data', ['+52', '+1']);
      fixture.detectChanges();
      expect(component.selectOptions()).toEqual([
        { label: '+52', value: '+52' },
        { label: '+1', value: '+1' },
      ]);
    });

    it('should compute selectOptions from object array data', () => {
      fixture.componentRef.setInput('data', [
        { label: 'México', value: '+52' },
        { label: 'USA', value: '+1' },
      ]);
      fixture.detectChanges();
      expect(component.selectOptions()).toEqual([
        { label: 'México', value: '+52' },
        { label: 'USA', value: '+1' },
      ]);
    });

    it('should compute getInputStyleClass as empty string by default', () => {
      expect(component.getInputStyleClass()).toBe('');
    });

    it('should compute getInputStyleClass as "p-inputgroup-sm" when size is "small"', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.getInputStyleClass()).toBe('p-inputgroup-sm');
    });

    it('should compute getInputStyleClass as "p-inputgroup-lg" when size is "large"', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.getInputStyleClass()).toBe('p-inputgroup-lg');
    });
  });

  describe('outputs', () => {
    it('should emit propagar output on onSelectItem', () => {
      const spy = vi.fn();
      component.propagar.subscribe(spy);
      const event = { value: '+52' };
      component.onSelectItem(event);
      expect(spy).toHaveBeenCalledWith(event);
    });
  });
});
