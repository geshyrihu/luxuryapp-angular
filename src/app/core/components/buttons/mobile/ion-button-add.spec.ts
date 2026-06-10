import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonAdd } from './ion-button-add';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}

  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  @Component({ selector: 'ion-fab', template: '<ng-content></ng-content>', standalone: true })
  class IonFabMock {}

  @Component({ selector: 'ion-fab-button', template: '<ng-content></ng-content>', standalone: true })
  class IonFabButtonMock {}

  return { IonItem: IonItemMock, IonLabel: IonLabelMock, IonIcon: IonIconMock, IonFab: IonFabMock, IonFabButton: IonFabButtonMock };
});

describe('IonButtonAdd', () => {
  let component: IonButtonAdd;
  let fixture: ComponentFixture<IonButtonAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonAdd],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary color by default', () => {
    expect(component.color()).toBe('primary');
  });

  it('should have fabMode false by default', () => {
    expect(component.fabMode()).toBe(false);
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
    const item = fixture.nativeElement.querySelector('ion-item');
    expect(item).toBeNull();
  });
});
