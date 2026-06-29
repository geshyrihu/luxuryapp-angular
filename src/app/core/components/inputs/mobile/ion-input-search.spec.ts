import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputSearch } from './ion-input-search';
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

describe('IonInputSearch', () => {
  let component: IonInputSearch;
  let fixture: ComponentFixture<IonInputSearch>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputSearch, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputSearch],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default debounce signal as 300', () => {
    expect(component.debounce()).toBe(300);
  });

  it('should allow setting debounce signal', () => {
    fixture.componentRef.setInput('debounce', 500);
    expect(component.debounce()).toBe(500);
  });

  it('should emit searchChange on onSearchChange', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);
    component.onSearchChange({ detail: { value: 'test' } });
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should emit null on onClear', () => {
    const spy = vi.fn();
    component.searchChange.subscribe(spy);
    component.onClear();
    expect(spy).toHaveBeenCalledWith(null);
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('search');
    expect(fn).toHaveBeenCalledWith('search');
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
