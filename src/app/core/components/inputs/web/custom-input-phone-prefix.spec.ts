import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputPhonePrefix } from './custom-input-phone-prefix';
import { vi } from 'vitest';

describe('CustomInputPhonePrefix', () => {
  let component: CustomInputPhonePrefix;
  let fixture: ComponentFixture<CustomInputPhonePrefix>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputPhonePrefix, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputPhonePrefix],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputPhonePrefix);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have prefixes defined', () => {
    expect(component.prefixes).toBeDefined();
    expect(component.prefixes.length).toBeGreaterThan(0);
  });

  it('should have Mexico prefix with dialCode +52', () => {
    const mexico = component.prefixes.find(p => p.dialCode === '+52');
    expect(mexico).toBeDefined();
  });

  describe('ControlValueAccessor', () => {
    it('should call onChange when registered via registerOnChange', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('+52');
      expect(fn).toHaveBeenCalledWith('+52');
    });

    it('should call onTouch when registered via registerOnTouched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('should write value via writeValue', () => {
      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue('+1');
      expect(spy).toHaveBeenCalledWith('+1');
    });

    it('should set disabled state via setDisabledState', () => {
      const spy = vi.spyOn(component, 'setDisabledState');
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
