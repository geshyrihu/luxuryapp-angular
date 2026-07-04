import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputCurrency } from './ion-input-currency';
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

describe('IonInputCurrency', () => {
  let component: IonInputCurrency;
  let fixture: ComponentFixture<IonInputCurrency>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputCurrency, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputCurrency],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputCurrency);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default prefix signal as "$ "', () => {
    expect(component.prefix()).toBe('$ ');
  });

  it('should allow setting prefix signal', () => {
    fixture.componentRef.setInput('prefix', '€ ');
    expect(component.prefix()).toBe('€ ');
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange(99.99);
    expect(fn).toHaveBeenCalledWith(99.99);
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
