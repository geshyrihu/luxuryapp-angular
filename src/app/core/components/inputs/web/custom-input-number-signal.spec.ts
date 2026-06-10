import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputNumberSignal } from './custom-input-number-signal';
import { vi } from 'vitest';

describe('CustomInputNumberSignal', () => {
  let component: CustomInputNumberSignal;
  let fixture: ComponentFixture<CustomInputNumberSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputNumberSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputNumberSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputNumberSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('default signal values', () => {
    it('should have default min value as undefined', () => {
      expect(component.min()).toBeUndefined();
    });

    it('should have default max value as undefined', () => {
      expect(component.max()).toBeUndefined();
    });

    it('should have default showButtons as false', () => {
      expect(component.showButtons()).toBe(false);
    });

    it('should have default step as 1', () => {
      expect(component.step()).toBe(1);
    });

    it('should have default minFractionDigits as undefined', () => {
      expect(component.minFractionDigits()).toBeUndefined();
    });

    it('should have default maxFractionDigits as undefined', () => {
      expect(component.maxFractionDigits()).toBeUndefined();
    });

    it('should have default customClass as empty string', () => {
      expect(component.customClass()).toBe('');
    });

    it('should have default size as undefined', () => {
      expect(component.size()).toBeUndefined();
    });

    it('should have default mode as "decimal"', () => {
      expect(component.mode()).toBe('decimal');
    });

    it('should have default currency as undefined', () => {
      expect(component.currency()).toBeUndefined();
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

    it('should have default locale as "es-MX"', () => {
      expect(component.locale()).toBe('es-MX');
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

  describe('outputs', () => {
    it('should emit blur output', () => {
      const spy = vi.fn();
      component.blur.subscribe(spy);
      component.blur.emit();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit enter output', () => {
      const spy = vi.fn();
      component.enter.subscribe(spy);
      component.enter.emit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
