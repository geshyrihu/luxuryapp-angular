import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputTextarea } from './ion-input-textarea';
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

describe('IonInputTextarea', () => {
  let component: IonInputTextarea;
  let fixture: ComponentFixture<IonInputTextarea>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputTextarea, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputTextarea],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default rows signal as 3', () => {
    expect(component.rows()).toBe(3);
  });

  it('should have default maxLength signal as undefined', () => {
    expect(component.maxLength()).toBeUndefined();
  });

  it('should have default autoGrow signal as true', () => {
    expect(component.autoGrow()).toBe(true);
  });

  it('should allow setting rows signal', () => {
    fixture.componentRef.setInput('rows', 5);
    expect(component.rows()).toBe(5);
  });

  it('should allow setting maxLength signal', () => {
    fixture.componentRef.setInput('maxLength', 500);
    expect(component.maxLength()).toBe(500);
  });

  it('should allow setting autoGrow signal', () => {
    fixture.componentRef.setInput('autoGrow', false);
    expect(component.autoGrow()).toBe(false);
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('text');
    expect(fn).toHaveBeenCalledWith('text');
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
