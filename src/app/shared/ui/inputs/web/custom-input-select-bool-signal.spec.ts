import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSelectBool } from './custom-input-select-bool-signal';
import { vi } from 'vitest';

describe('CustomInputSelectBool', () => {
  let component: CustomInputSelectBool;
  let fixture: ComponentFixture<CustomInputSelectBool>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSelectBool, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputSelectBool],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default activeLabel as "Activo"', () => {
      expect(component.activeLabel()).toBe('Activo');
    });

    it('should have default inactiveLabel as "Inactivo"', () => {
      expect(component.inactiveLabel()).toBe('Inactivo');
    });

    it('should have default showClear as true', () => {
      expect(component.showClear()).toBe(true);
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });
  });

  describe('computed properties', () => {
    it('should compute boolOptions with default labels', () => {
      const options = component.boolOptions();
      expect(options).toEqual([
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' },
      ]);
    });

    it('should compute boolOptions with custom labels', () => {
      fixture.componentRef.setInput('activeLabel', 'Sí');
      fixture.componentRef.setInput('inactiveLabel', 'No');
      fixture.detectChanges();
      const options = component.boolOptions();
      expect(options).toEqual([
        { value: true, label: 'Sí' },
        { value: false, label: 'No' },
      ]);
    });

    it('should compute getInputStyleClass as empty string by default', () => {
      expect(component.getInputStyleClass()).toBe('');
    });

    it('should compute getInputStyleClass as "p-inputtext-sm" when size is "small"', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.getInputStyleClass()).toBe('p-inputtext-sm');
    });

    it('should compute getInputStyleClass as "p-inputtext-lg" when size is "large"', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.getInputStyleClass()).toBe('p-inputtext-lg');
    });
  });
});
