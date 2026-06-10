import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { IonButtonItem } from './ion-button-item';
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

describe('IonButtonItem', () => {
  let component: IonButtonItem;
  let fixture: ComponentFixture<IonButtonItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonItem],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have primary color by default', () => {
    expect(component.color()).toBe('primary');
  });

  it('should default label to "Acción" via getLabel', () => {
    expect(component.getLabel()).toBe('Acción');
  });

  it('should return custom label from getLabel', () => {
    fixture.componentRef.setInput('label', 'Custom');
    fixture.detectChanges();
    expect(component.getLabel()).toBe('Custom');
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
