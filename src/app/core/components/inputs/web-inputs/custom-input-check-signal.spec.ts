import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputCheckSignal } from './custom-input-check-signal';
import { vi } from 'vitest';

describe('CustomInputCheckSignal', () => {
  let component: CustomInputCheckSignal;
  let fixture: ComponentFixture<CustomInputCheckSignal>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputCheckSignal, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputCheckSignal],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputCheckSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('outputs', () => {
    it('should emit checkChange output with boolean value', () => {
      const spy = vi.fn();
      component.checkChange.subscribe(spy);
      component.checkChange.emit(true);
      expect(spy).toHaveBeenCalledWith(true);
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
      component.writeValue(true);
      expect(component.internalControl.value).toBe(true);
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.internalControl.disabled).toBe(true);
      component.setDisabledState(false);
      expect(component.internalControl.enabled).toBe(true);
    });
  });
});
