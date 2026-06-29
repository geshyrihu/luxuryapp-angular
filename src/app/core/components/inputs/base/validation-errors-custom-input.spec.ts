import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrorsCustomInput } from './validation-errors-custom-input';
import { FormControl, Validators } from '@angular/forms';

describe('ValidationErrorsCustomInput', () => {
  let component: ValidationErrorsCustomInput;
  let fixture: ComponentFixture<ValidationErrorsCustomInput>;
  let control: FormControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationErrorsCustomInput],
    });
    fixture = TestBed.createComponent(ValidationErrorsCustomInput);
    component = fixture.componentInstance;
    control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('placeholder', 'Test Field');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show errors when control is pristine', () => {
    expect(component.shouldShowErrors()).toBe(false);
  });

  it('should show errors when control is dirty and invalid', () => {
    component.shouldShowErrors();
    control.markAsDirty();
    expect(component.shouldShowErrors()).toBe(true);
  });

  it('should show errors when control is touched and invalid', () => {
    component.shouldShowErrors();
    control.markAsTouched();
    expect(component.shouldShowErrors()).toBe(true);
  });

  it('should return required error message', () => {
    control.markAsDirty();
    const errors = component.getErrors();
    expect(errors).toContain('El campo Test Field es requerido.');
  });

  it('should return minlength error message', () => {
    control = new FormControl('a', [Validators.minLength(3)]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    const errors = component.getErrors();
    expect(errors[0]).toContain('mínimo 3 caracteres');
  });

  it('should return maxlength error message', () => {
    control = new FormControl('aaaa', [Validators.maxLength(3)]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    const errors = component.getErrors();
    expect(errors[0]).toContain('máximo 3 caracteres');
  });

  it('should return email error message', () => {
    control = new FormControl('invalid', [Validators.email]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    const errors = component.getErrors();
    expect(errors[0]).toBe('Ingresa un email válido');
  });

  it('should return pattern error message', () => {
    control = new FormControl('abc', [Validators.pattern('^[0-9]+$')]);
    fixture.componentRef.setInput('control', control);
    control.markAsDirty();
    const errors = component.getErrors();
    expect(errors[0]).toContain('formato de Test Field es inválido');
  });

  it('should return custom error message', () => {
    const customControl = new FormControl('', { validators: Validators.required });
    customControl.markAsDirty();
    customControl.setValue('');
    customControl.setErrors({ customError: 'Custom error text' });
    fixture.componentRef.setInput('control', customControl);
    fixture.detectChanges();
    const errors = component.getErrors();
    expect(errors).toContain('Custom error text');
  });
});
