import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputMultiselect } from './ion-input-multiselect';
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

describe('IonInputMultiselect', () => {
  let component: IonInputMultiselect;
  let fixture: ComponentFixture<IonInputMultiselect>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputMultiselect, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputMultiselect],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputMultiselect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default options signal as empty array', () => {
    expect(component.options()).toEqual([]);
  });

  it('should have default optionLabel signal as "label"', () => {
    expect(component.optionLabel()).toBe('label');
  });

  it('should have default optionValue signal as "value"', () => {
    expect(component.optionValue()).toBe('value');
  });

  it('should have default cancelText signal as "Cancelar"', () => {
    expect(component.cancelText()).toBe('Cancelar');
  });

  it('should have default okText signal as "Aceptar"', () => {
    expect(component.okText()).toBe('Aceptar');
  });

  it('should allow setting options signal', () => {
    const items = [{ label: 'A', value: 1 }, { label: 'B', value: 2 }];
    fixture.componentRef.setInput('options', items);
    expect(component.options()).toEqual(items);
  });

  it('should emit selectionChange on onSelectionChange', () => {
    const spy = vi.fn();
    component.selectionChange.subscribe(spy);
    const event = { detail: { value: ['opt1', 'opt2'] } };
    component.onSelectionChange(event);
    expect(spy).toHaveBeenCalledWith(['opt1', 'opt2']);
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange(['a', 'b']);
    expect(fn).toHaveBeenCalledWith(['a', 'b']);
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
