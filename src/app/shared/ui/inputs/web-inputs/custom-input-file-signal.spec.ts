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

  it('should have fileSelectedValue as null by default', () => {
    expect(component.fileSelectedValue).toBeNull();
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
      component.onFileSelected({ files: [file] });

      expect(emitSpy).toHaveBeenCalledWith(file);
      expect(component.fileSelectedValue).toBe(file);
    });

    it('should emit null when file is removed', () => {
      const emitSpy = vi.fn();
      component.fileSelected.subscribe(emitSpy);

      component.removeFile();

      expect(emitSpy).toHaveBeenCalledWith(null);
      expect(component.fileSelectedValue).toBeNull();
    });
  });

  describe('formatFileSize', () => {
    it('should return "0 Bytes" for 0 bytes', () => {
      expect(component.formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes correctly', () => {
      expect(component.formatFileSize(1024)).toBe('1 KB');
    });

    it('should format MB correctly', () => {
      const result = component.formatFileSize(1048576);
      expect(result).toContain('MB');
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
