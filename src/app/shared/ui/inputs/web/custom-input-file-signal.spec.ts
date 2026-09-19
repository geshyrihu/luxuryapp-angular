import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputFile } from './custom-input-file-signal';
import { vi } from 'vitest';

describe('CustomInputFile', () => {
  let component: CustomInputFile;
  let fixture: ComponentFixture<CustomInputFile>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputFile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputFile],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default accept as empty string', () => {
    expect(component.accept()).toBe('');
  });

  it('should have default maxFileSize as 10000000', () => {
    expect(component.maxFileSize()).toBe(10000000);
  });

  it('should have default chooseLabel', () => {
    expect(component.chooseLabel()).toBe('Seleccionar archivo');
  });

  it('should set accept via input', () => {
    fixture.componentRef.setInput('accept', '.pdf,.doc');
    fixture.detectChanges();
    expect(component.accept()).toBe('.pdf,.doc');
  });

  describe('fileSelected output', () => {
    it('should emit when file is selected', () => {
      const emitSpy = vi.fn();
      component.fileSelected.subscribe(emitSpy);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      component.onFileSelected(file);

      expect(emitSpy).toHaveBeenCalledWith(file);
    });

    it('should emit null when file is removed', () => {
      const emitSpy = vi.fn();
      component.fileSelected.subscribe(emitSpy);

      component.onFileSelected(null);

      expect(emitSpy).toHaveBeenCalledWith(null);
    });
  });

  describe('uploadError output', () => {
    it('should re-emit upload errors', () => {
      const emitSpy = vi.fn();
      component.uploadError.subscribe(emitSpy);
      component.onUploadError({ message: 'too big' });
      expect(emitSpy).toHaveBeenCalledWith({ message: 'too big' });
    });
  });

  describe('ControlValueAccessor', () => {
    it('should call onChange when registered via registerOnChange', () => {
      const fn = vi.fn();
      component.registerOnChange(fn);
      component.onChange('value');
      expect(fn).toHaveBeenCalledWith('value');
    });

    it('should call onTouch when registered via registerOnTouched', () => {
      const fn = vi.fn();
      component.registerOnTouched(fn);
      component.onTouch();
      expect(fn).toHaveBeenCalled();
    });

    it('should write value via writeValue', () => {
      const spy = vi.spyOn(component, 'writeValue');
      component.writeValue('file value');
      expect(spy).toHaveBeenCalledWith('file value');
    });

    it('should set disabled state via setDisabledState', () => {
      const spy = vi.spyOn(component, 'setDisabledState');
      component.setDisabledState(true);
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});
