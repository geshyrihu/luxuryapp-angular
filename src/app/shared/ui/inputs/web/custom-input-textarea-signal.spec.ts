import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputTextAreaSignal } from './custom-input-textarea-signal';
import { vi } from 'vitest';

describe('CustomInputTextAreaSignal', () => {
  let component: CustomInputTextAreaSignal;
  let fixture: ComponentFixture<CustomInputTextAreaSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputTextAreaSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputTextAreaSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputTextAreaSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default rows as 5', () => {
    expect(component.rows()).toBe(5);
  });

  it('should have default cols as 30', () => {
    expect(component.cols()).toBe(30);
  });

  it('should have default maxLength as undefined', () => {
    expect(component.maxLength()).toBeUndefined();
  });

  it('should have default disableResize as false', () => {
    expect(component.disableResize()).toBe(false);
  });

  it('should have default customClass as empty string', () => {
    expect(component.customClass()).toBe('');
  });

  it('should have default fluid as true', () => {
    expect(component.fluid()).toBe(true);
  });

  it('should set rows via input', () => {
    fixture.componentRef.setInput('rows', 10);
    fixture.detectChanges();
    expect(component.rows()).toBe(10);
  });

  it('should set maxLength via input', () => {
    fixture.componentRef.setInput('maxLength', 500);
    fixture.detectChanges();
    expect(component.maxLength()).toBe(500);
  });

  it('should set disableResize via input', () => {
    fixture.componentRef.setInput('disableResize', true);
    fixture.detectChanges();
    expect(component.disableResize()).toBe(true);
  });

  describe('ControlValueAccessor', () => {
    it('should call onChange when registered via registerOnChange', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('textarea value');
      expect(fn).toHaveBeenCalledWith('textarea value');
    });

    it('should call onTouch when registered via registerOnTouched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('should write value via writeValue', () => {
      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue('new text');
      expect(spy).toHaveBeenCalledWith('new text');
    });

    it('should set disabled state via setDisabledState', () => {
      const spy = vi.spyOn(component, 'setDisabledState');
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
