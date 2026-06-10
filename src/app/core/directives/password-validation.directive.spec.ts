import { PasswordValidationDirective } from './password-validation.directive';
import { AbstractControl, FormControl } from '@angular/forms';

describe('PasswordValidationDirective', () => {
  let directive: PasswordValidationDirective;

  beforeEach(() => {
    directive = new PasswordValidationDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should return null for empty password', () => {
    const control = new FormControl('');
    const result = directive.validate(control);
    expect(result).toBeUndefined();
  });

  it('should return null for null password', () => {
    const control = new FormControl(null);
    const result = directive.validate(control);
    expect(result).toBeUndefined();
  });

  it('should return error for password shorter than 6 characters', () => {
    const control = new FormControl('Ab1');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'El password debe ser de mínimo 6 caracteres' },
    });
  });

  it('should return error for prohibited password "123456"', () => {
    const control = new FormControl('123456');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Escoge un mejor password' },
    });
  });

  it('should return error for prohibited password "querty"', () => {
    const control = new FormControl('querty');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Escoge un mejor password' },
    });
  });

  it('should return error for prohibited password "123456789"', () => {
    const control = new FormControl('123456789');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Escoge un mejor password' },
    });
  });

  it('should return error for password without uppercase letters', () => {
    const control = new FormControl('abc1def');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Tu password debe de contener mayúsculas' },
    });
  });

  it('should return error for password without lowercase letters', () => {
    const control = new FormControl('ABC1DEF');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Tu password debe de contener minúsculas' },
    });
  });

  it('should return error for password without numeric character', () => {
    const control = new FormControl('Abcdefg');
    const result = directive.validate(control);
    expect(result).toEqual({
      passwordValidation: { message: 'Tu password debe de incluir un caracter numérico' },
    });
  });

  it('should return null for valid password', () => {
    const control = new FormControl('Abc1def');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });

  it('should return null for password with all requirements met', () => {
    const control = new FormControl('ValidP4ss');
    const result = directive.validate(control);
    expect(result).toBeNull();
  });
});
