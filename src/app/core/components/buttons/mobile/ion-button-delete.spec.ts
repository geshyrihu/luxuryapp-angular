import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IonButtonDelete } from './ion-button-delete';
import { vi } from 'vitest';
import { AlertController } from '@ionic/angular/standalone';

// Mock de Ionic
vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');
  
  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}
  
  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}
  
  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  const alertMock = {
    present: vi.fn().mockResolvedValue(undefined),
  };
  
  const alertControllerMock = {
    create: vi.fn().mockResolvedValue(alertMock),
  };

  return {
    IonItem: IonItemMock,
    IonLabel: IonLabelMock,
    IonIcon: IonIconMock,
    AlertController: class {
      create = alertControllerMock.create;
    },
  };
});

describe('IonButtonDelete', () => {
  let component: IonButtonDelete;
  let fixture: ComponentFixture<IonButtonDelete>;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonButtonDelete],
      providers: [
        AlertController,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IonButtonDelete);
    component = fixture.componentInstance;
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have danger color by default', () => {
    expect(component.color()).toBe('danger');
  });

  it('should call alertController.create on click', async () => {
    const btn = fixture.nativeElement.querySelector('ion-item');
    btn.click();
    
    expect(alertController.create).toHaveBeenCalled();
  });

  it('should use confirmLinkedMessage when isLinked is true', async () => {
    fixture.componentRef.setInput('isLinked', true);
    fixture.detectChanges();

    await component.confirmDelete(new MouseEvent('click'));
    
    expect(alertController.create).toHaveBeenCalledWith(expect.objectContaining({
      message: component.confirmLinkedMessage()
    }));
  });

  it('should not show when mostrar() is false', () => {
    fixture.componentRef.setInput('mostrar', false);
    fixture.detectChanges();
    
    const btn = fixture.nativeElement.querySelector('ion-item');
    expect(btn).toBeNull();
  });
});
