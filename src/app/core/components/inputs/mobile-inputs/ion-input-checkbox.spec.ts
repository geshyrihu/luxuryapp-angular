import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputCheckbox } from './ion-input-checkbox';
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

describe('IonInputCheckbox', () => {
  let component: IonInputCheckbox;
  let fixture: ComponentFixture<IonInputCheckbox>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputCheckbox, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputCheckbox],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default control signal as undefined', () => {
    expect(component.control()).toBeUndefined();
  });

  it('should emit checkChange on onCheckboxChange', () => {
    const spy = vi.fn();
    component.checkChange.subscribe(spy);
    component.onCheckboxChange({ detail: { checked: true } });
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should emit false from checkChange', () => {
    const spy = vi.fn();
    component.checkChange.subscribe(spy);
    component.onCheckboxChange({ detail: { checked: false } });
    expect(spy).toHaveBeenCalledWith(false);
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
