import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputSelect } from './ion-input-select';
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

describe('IonInputSelect', () => {
  let component: IonInputSelect;
  let fixture: ComponentFixture<IonInputSelect>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputSelect, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputSelect],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default data signal as empty array', () => {
    expect(component.data()).toEqual([]);
  });

  it('should have default optionLabel signal as "label"', () => {
    expect(component.optionLabel()).toBe('label');
  });

  it('should have default optionValue signal as "value"', () => {
    expect(component.optionValue()).toBe('value');
  });

  it('should have default interfaceMode signal as "action-sheet"', () => {
    expect(component.interfaceMode()).toBe('action-sheet');
  });

  it('should have default cancelText signal as "Cancelar"', () => {
    expect(component.cancelText()).toBe('Cancelar');
  });

  it('should have default okText signal as "Aceptar"', () => {
    expect(component.okText()).toBe('Aceptar');
  });

  it('should allow setting data signal', () => {
    const items = [{ label: 'A', value: 1 }];
    fixture.componentRef.setInput('data', items);
    expect(component.data()).toEqual(items);
  });

  it('should emit selectionChange on onSelectionChange', () => {
    const spy = vi.fn();
    component.selectionChange.subscribe(spy);
    const event = { detail: { value: 'opt1' } };
    component.onSelectionChange(event);
    expect(spy).toHaveBeenCalledWith('opt1');
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('val');
    expect(fn).toHaveBeenCalledWith('val');
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
