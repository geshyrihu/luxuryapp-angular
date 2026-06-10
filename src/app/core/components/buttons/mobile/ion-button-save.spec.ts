import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonSave } from './ion-button-save';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  @Component({ selector: 'ion-spinner', template: '', standalone: true })
  class IonSpinnerMock {}

  return { IonButton: IonButtonMock, IonIcon: IonIconMock, IonSpinner: IonSpinnerMock };
});

describe('IonButtonSave', () => {
  let component: IonButtonSave;
  let fixture: ComponentFixture<IonButtonSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonSave],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary color and solid fill by default', () => {
    expect(component.color()).toBe('primary');
    expect(component.fill()).toBe('solid');
  });

  it('should show "Guardar" when propertyId is null', () => {
    expect(component.finalLabel()).toBe('Guardar');
  });

  it('should show "Actualizar" when propertyId is provided', () => {
    fixture.componentRef.setInput('propertyId', '123');
    fixture.detectChanges();
    expect(component.finalLabel()).toBe('Actualizar');
  });

  it('should use custom label when provided', () => {
    fixture.componentRef.setInput('label', 'Custom Save');
    fixture.detectChanges();
    expect(component.finalLabel()).toBe('Custom Save');
  });

  it('should show sync icon when propertyId is provided', () => {
    fixture.componentRef.setInput('propertyId', '123');
    fixture.detectChanges();
    expect(component.finalIcon()).toBe('sync-outline');
  });

  it('should show save icon when propertyId is null', () => {
    expect(component.finalIcon()).toBe('save-outline');
  });

  it('should emit onClick on click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should hide when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('ion-button');
    expect(btn).toBeNull();
  });
});
