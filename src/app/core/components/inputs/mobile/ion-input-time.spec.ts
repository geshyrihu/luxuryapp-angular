import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IonInputTime } from './ion-input-time';
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

describe('IonInputTime', () => {
  let component: IonInputTime;
  let fixture: ComponentFixture<IonInputTime>;

  beforeEach(() => {
    TestBed.overrideComponent(IonInputTime, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [IonInputTime],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(IonInputTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default control signal as undefined', () => {
    expect(component.control()).toBeUndefined();
  });

  it('should have default disabled signal as false', () => {
    expect(component.disabled()).toBe(false);
  });

  it('should set onChange callback via registerOnChange', () => {
    const fn = vi.fn();
    component.registerOnChange(fn);
    component.onChange('14:30');
    expect(fn).toHaveBeenCalledWith('14:30');
  });

  it('should set onTouch callback via registerOnTouched', () => {
    const fn = vi.fn();
    component.registerOnTouched(fn);
    component.onTouch();
    expect(fn).toHaveBeenCalled();
  });
});
