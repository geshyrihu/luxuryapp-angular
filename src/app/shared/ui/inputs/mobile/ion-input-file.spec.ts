import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputFile } from './ion-input-file';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', () => ({
  IonInput: class {},
  IonNote: class {},
  IonSelect: class {},
  IonSelectOption: class {},
  IonTextarea: class {},
  IonToggle: class {},
  IonDatetime: class {},
  IonCheckbox: class {},
  IonSearchbar: class {},
  IonButton: class {},
  IonIcon: class {},
}));

describe('IonInputFile', () => {
  let component: IonInputFile;
  let fixture: ComponentFixture<IonInputFile>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputFile, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputFile],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default accept signal as empty string', () => {
    expect(component.accept()).toBe('');
  });

  it('should allow setting accept signal', () => {
    fixture.componentRef.setInput('accept', '.pdf,.doc');
    expect(component.accept()).toBe('.pdf,.doc');
  });

  it('should have default maxFileSize signal as 10000000', () => {
    expect(component.maxFileSize()).toBe(10000000);
  });

  it('should allow setting maxFileSize signal', () => {
    fixture.componentRef.setInput('maxFileSize', 5000000);
    expect(component.maxFileSize()).toBe(5000000);
  });

  it('should have default chooseLabel signal as "Seleccionar archivo"', () => {
    expect(component.chooseLabel()).toBe('Seleccionar archivo');
  });

  it('should allow setting chooseLabel signal', () => {
    fixture.componentRef.setInput('chooseLabel', 'Choose file');
    expect(component.chooseLabel()).toBe('Choose file');
  });

  it('should emit fileSelected on onFileSelected', () => {
    const spy = vi.fn();
    component.fileSelected.subscribe(spy);
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    component.onFileSelected({ target: { files: [file], value: '' } });
    expect(spy).toHaveBeenCalledWith(file);
  });

  it('should emit null on removeFile', () => {
    const spy = vi.fn();
    component.fileSelected.subscribe(spy);
    component.removeFile();
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should emit uploadError when file exceeds max size', () => {
    const spy = vi.fn();
    component.uploadError.subscribe(spy);
    const largeFile = new File(['x'.repeat(20000000)], 'large.txt', { type: 'text/plain' });
    component.onFileSelected({ target: { files: [largeFile], value: '' } });
    expect(spy).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(0)).toBe('0 B');
    expect(component.formatFileSize(1024)).toBe('1 KB');
    expect(component.formatFileSize(1048576)).toBe('1 MB');
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange(null);
    expect(fn).toHaveBeenCalledWith(null);
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
