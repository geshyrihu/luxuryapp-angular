import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputSelectBool } from './ion-input-select-bool';
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

describe('IonInputSelectBool', () => {
  let component: IonInputSelectBool;
  let fixture: ComponentFixture<IonInputSelectBool>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputSelectBool, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputSelectBool],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputSelectBool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default activeLabel signal as "Activo"', () => {
    expect(component.activeLabel()).toBe('Activo');
  });

  it('should have default inactiveLabel signal as "Inactivo"', () => {
    expect(component.inactiveLabel()).toBe('Inactivo');
  });

  it('should allow setting activeLabel signal', () => {
    fixture.componentRef.setInput('activeLabel', 'Sí');
    expect(component.activeLabel()).toBe('Sí');
  });

  it('should allow setting inactiveLabel signal', () => {
    fixture.componentRef.setInput('inactiveLabel', 'No');
    expect(component.inactiveLabel()).toBe('No');
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange(true);
    expect(fn).toHaveBeenCalledWith(true);
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
