import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputDecimal } from './custom-input-decimal-signal';
import { vi } from 'vitest';

describe('CustomInputDecimal', () => {
  let component: CustomInputDecimal;
  let fixture: ComponentFixture<CustomInputDecimal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputDecimal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputDecimal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputDecimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default showButtons as false', () => {
      expect(component.showButtons()).toBe(false);
    });

    it('should have default minFractionDigits as 0', () => {
      expect(component.minFractionDigits()).toBe(0);
    });

    it('should have default maxFractionDigits as 4', () => {
      expect(component.maxFractionDigits()).toBe(4);
    });

    it('should have default customClass as empty string', () => {
      expect(component.customClass()).toBe('');
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });

    it('should have default useGrouping as true', () => {
      expect(component.useGrouping()).toBe(true);
    });

    it('should have default prefix as undefined', () => {
      expect(component.prefix()).toBeUndefined();
    });

    it('should have default suffix as undefined', () => {
      expect(component.suffix()).toBeUndefined();
    });

    it('should have default showClear as false', () => {
      expect(component.showClear()).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should compute inputStyleClass with default empty string', () => {
      expect(component.inputStyleClass()).toBe('');
    });

    it('should compute inputStyleClass with "p-inputtext-sm" when size is "small"', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(component.inputStyleClass()).toBe('p-inputtext-sm');
    });

    it('should compute inputStyleClass with "p-inputtext-lg" when size is "large"', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(component.inputStyleClass()).toBe('p-inputtext-lg');
    });

    it('should include customClass in inputStyleClass', () => {
      fixture.componentRef.setInput('customClass', 'my-class');
      fixture.detectChanges();
      expect(component.inputStyleClass()).toBe('my-class');
    });
  });
});
