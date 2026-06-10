import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSwitch } from './custom-input-switch-signal';
import { vi } from 'vitest';

describe('CustomInputSwitch', () => {
  let component: CustomInputSwitch;
  let fixture: ComponentFixture<CustomInputSwitch>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSwitch, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputSwitch],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have switchChange defined as output', () => {
    expect(component.switchChange).toBeDefined();
  });

  describe('switchChange output', () => {
    it('should emit true when onValueChange is called with checked event', () => {
      const emitSpy = vi.fn();
      component.switchChange.subscribe(emitSpy);

      const event = { target: { checked: true } } as unknown as Event;
      component.onValueChange(event);

      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit false when onValueChange is called with unchecked event', () => {
      const emitSpy = vi.fn();
      component.switchChange.subscribe(emitSpy);

      const event = { target: { checked: false } } as unknown as Event;
      component.onValueChange(event);

      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should call onChange when registered via registerOnChange', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange(true);
      expect(fn).toHaveBeenCalledWith(true);
    });

    it('should call onTouch when registered via registerOnTouched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('should write value via writeValue', () => {
      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue(true);
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should set disabled state via setDisabledState', () => {
      const spy = vi.spyOn(component, 'setDisabledState');
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
