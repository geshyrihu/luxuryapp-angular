import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonEdit } from './ion-button-edit';
import { vi } from 'vitest';

vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');

  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}

  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}

  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return { IonItem: IonItemMock, IonLabel: IonLabelMock, IonIcon: IonIconMock };
});

describe('IonButtonEdit', () => {
  let component: IonButtonEdit;
  let fixture: ComponentFixture<IonButtonEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonEdit],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary color by default', () => {
    expect(component.color()).toBe('primary');
  });

  it('should emit onClick on click', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    component.onClick(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should have empty label by default (template shows "Editar" via ||)', () => {
    expect(component.label()).toBe('');
  });

  it('should hide when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector('ion-item');
    expect(item).toBeNull();
  });
});
