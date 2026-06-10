import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { BaseIonicInput } from './base-ionic-input';
import { FormControl, Validators } from '@angular/forms';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-note', template: '<ng-content></ng-content>', standalone: true })
  class IonNoteMock {}

  return { IonNote: IonNoteMock };
});

describe('BaseIonicInput', () => {
  let component: BaseIonicInput;
  let fixture: ComponentFixture<BaseIonicInput>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BaseIonicInput],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(BaseIonicInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return "full" for lines', () => {
    expect(component.lines()).toBe('full');
  });

  it('should return empty string for customClass', () => {
    expect(component.customClass()).toBe('');
  });

  it('should not show errors when control is pristine', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    expect(component.shouldShowErrors()).toBe(false);
  });

  it('should show errors when control is dirty', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    fixture.detectChanges();
    expect(component.shouldShowErrors()).toBe(true);
  });

  it('should return required error message', () => {
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('placeholder', 'Test');
    control.markAsDirty();
    fixture.detectChanges();
    const errors = component.getValidationErrors();
    expect(errors).toContain('Test es requerido.');
  });

  it('should return minlength error message', () => {
    const control = new FormControl('a', [Validators.minLength(3)]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    control.setValue('a');
    const errors = component.getValidationErrors();
    expect(errors[0]).toContain('Mínimo 3 caracteres');
  });

  it('should return email error message', () => {
    const control = new FormControl('invalid', [Validators.email]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    control.setValue('invalid');
    const errors = component.getValidationErrors();
    expect(errors[0]).toBe('Email inválido.');
  });
});
