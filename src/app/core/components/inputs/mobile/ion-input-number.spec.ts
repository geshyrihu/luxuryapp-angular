import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputNumber } from './ion-input-number';
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

describe('IonInputNumber', () => {
  let component: IonInputNumber;
  let fixture: ComponentFixture<IonInputNumber>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputNumber, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputNumber],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default min signal as undefined', () => {
    expect(component.min()).toBeUndefined();
  });

  it('should have default max signal as undefined', () => {
    expect(component.max()).toBeUndefined();
  });

  it('should have default step signal as 1', () => {
    expect(component.step()).toBe(1);
  });

  it('should allow setting min signal', () => {
    fixture.componentRef.setInput('min', 0);
    expect(component.min()).toBe(0);
  });

  it('should allow setting max signal', () => {
    fixture.componentRef.setInput('max', 100);
    expect(component.max()).toBe(100);
  });

  it('should allow setting step signal', () => {
    fixture.componentRef.setInput('step', 0.5);
    expect(component.step()).toBe(0.5);
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange(42);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
