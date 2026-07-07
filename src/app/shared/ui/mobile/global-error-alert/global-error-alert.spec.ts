import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { MobileGlobalErrorAlert as GlobalErrorAlert } from './global-error-alert';
import { GlobalErrorService } from '../../../core/services/global-error.service';
import { CommonModule } from '@angular/common';

// Mock de Ionicons
vi.mock('ionicons', () => ({
  addIcons: vi.fn(),
}));
vi.mock('ionicons/icons', () => ({
  alertCircleOutline: 'alert-circle-outline',
  closeOutline: 'close-outline',
}));

// Mock de Ionic
vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');
  
  @Component({ selector: 'ion-item', template: '<ng-content></ng-content>', standalone: true })
  class IonItemMock {}
  
  @Component({ selector: 'ion-label', template: '<ng-content></ng-content>', standalone: true })
  class IonLabelMock {}
  
  @Component({ selector: 'ion-button', template: '<ng-content></ng-content>', standalone: true })
  class IonButtonMock {}
  
  @Component({ selector: 'ion-icon', template: '', standalone: true })
  class IonIconMock {}

  return {
    IonItem: IonItemMock,
    IonLabel: IonLabelMock,
    IonButton: IonButtonMock,
    IonIcon: IonIconMock,
  };
});

describe('GlobalErrorAlert', () => {
  let component: GlobalErrorAlert;
  let fixture: ComponentFixture<GlobalErrorAlert>;
  let globalErrorService: GlobalErrorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalErrorAlert, CommonModule],
      providers: [GlobalErrorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    globalErrorService = TestBed.inject(GlobalErrorService);
    fixture = TestBed.createComponent(GlobalErrorAlert);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('no debe mostrar nada si no hay error', () => {
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.global-error-alert');
    expect(alert).toBeNull();
  });

  it('debe mostrar el mensaje de error cuando existe', async () => {
    const message = 'Error de prueba';
    globalErrorService.setGlobalError(message);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('ion-label');
    expect(label).not.toBeNull();
    expect(label.textContent).toContain(message);
  });

  it('debe llamar a clearError al cerrar el alert', async () => {
    globalErrorService.setGlobalError('Error');
    fixture.detectChanges();

    const spy = vi.spyOn(globalErrorService, 'clearError');
    const closeBtn = fixture.nativeElement.querySelector('.close-btn');
    expect(closeBtn).not.toBeNull();
    closeBtn.click();

    expect(spy).toHaveBeenCalled();
  });
});
