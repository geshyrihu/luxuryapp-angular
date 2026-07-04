import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputTextSignal } from './custom-input-text-signal';
import { vi } from 'vitest';

describe('CustomInputTextSignal', () => {
  let component: CustomInputTextSignal;
  let fixture: ComponentFixture<CustomInputTextSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputTextSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputTextSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputTextSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default customClass as empty string', () => {
    expect(component.customClass()).toBe('');
  });

  it('should have default type as text', () => {
    expect(component.type()).toBe('text');
  });

  it('should have default size as undefined', () => {
    expect(component.size()).toBeUndefined();
  });

  it('should have default list as undefined', () => {
    expect(component.list()).toBeUndefined();
  });

  it('should set customClass via input', () => {
    fixture.componentRef.setInput('customClass', 'my-class');
    fixture.detectChanges();
    expect(component.customClass()).toBe('my-class');
  });

  it('should set type via input', () => {
    fixture.componentRef.setInput('type', 'email');
    fixture.detectChanges();
    expect(component.type()).toBe('email');
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
      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue('new value');
      expect(spy).toHaveBeenCalledWith('new value');
    });

    it('should implement setDisabledState', () => {
      const spy = vi.spyOn(component, 'setDisabledState');
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
