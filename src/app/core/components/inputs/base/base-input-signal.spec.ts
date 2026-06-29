import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseInputSignal } from './base-input-signal';
import { FormControl, Validators } from '@angular/forms';

describe('BaseInputSignal', () => {
  let component: BaseInputSignal;
  let fixture: ComponentFixture<BaseInputSignal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseInputSignal],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(BaseInputSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have horizontal true by default', () => {
    expect(component.horizontal()).toBe(true);
  });

  it('should generate random id when not provided', () => {
    expect(component.id()).toContain('input-');
  });

  it('should use provided id', () => {
    fixture.componentRef.setInput('id', 'custom-id');
    fixture.detectChanges();
    expect(component.id()).toBe('custom-id');
  });

  it('should set display none when hidden', () => {
    fixture.componentRef.setInput('hidden', true);
    fixture.detectChanges();
    expect(component.display).toBe('none');
  });

  it('should not set display none when not hidden', () => {
    expect(component.display).toBeNull();
  });

  it('should detect required from validator', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.isRequired()).toBe(true);
  });

  it('should detect required from requiredInput alias', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    expect(component.isRequired()).toBe(true);
  });

  it('should disable control when disabled input is true', () => {
    const control = new FormControl('test');
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(control.disabled).toBe(true);
  });

  it('should enable control when disabled input is false', () => {
    const control = new FormControl({ value: 'test', disabled: true });
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    expect(control.enabled).toBe(true);
  });

  it('should return false for isInvalid when control is valid', () => {
    const control = new FormControl('valid');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.isInvalid()).toBe(false);
  });

  it('should return true for isInvalid when control is invalid and dirty', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    fixture.detectChanges();
    expect(component.isInvalid()).toBe(true);
  });

  it('should write value to control via writeValue', () => {
    const control = new FormControl('');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    component.writeValue('new value');
    expect(control.value).toBe('new value');
  });

  it('should call onChange when internal control value changes', () => {
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component.internalControl.setValue('test value');
    expect(spy).toHaveBeenCalledWith('test value');
  });
});
