import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Loader } from './loader';
import { LoaderService } from 'src/app/core/services/loader.service';

// Mock de Ionic para evitar errores de Stencil en tests
vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');
  @Component({
    selector: 'ion-spinner',
    template: '',
    standalone: true,
  })
  class IonSpinnerMock {}
  return { IonSpinner: IonSpinnerMock };
});

describe('Loader Component', () => {
  let component: Loader;
  let fixture: ComponentFixture<Loader>;
  let loaderServiceMock: any;

  beforeEach(async () => {
    // Mock del LoaderService
    const loadingSignal = signal<boolean>(false);
    loaderServiceMock = {
      loading$: loadingSignal,
      show: () => loadingSignal.set(true),
      hide: () => loadingSignal.set(false),
    };

    await TestBed.configureTestingModule({
      imports: [Loader],
      providers: [
        { provide: LoaderService, useValue: loaderServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe mostrar nada si isLoading es false', () => {
    const loaderContainer = fixture.nativeElement.querySelector('.loader-container');
    const mobileContainer = fixture.nativeElement.querySelector('.mobile-loader-container');
    
    expect(loaderContainer).toBeNull();
    expect(mobileContainer).toBeNull();
  });

  it('debe mostrar el loader cuando isLoading es true', () => {
    // Activar el loading a través del mock
    loaderServiceMock.show();
    fixture.detectChanges();

    const loaderContainer = fixture.nativeElement.querySelector('.loader-container');
    const mobileContainer = fixture.nativeElement.querySelector('.mobile-loader-container');
    
    expect(loaderContainer).not.toBeNull();
    expect(mobileContainer).not.toBeNull();
  });

  it('debe tener el texto de "Cargando..."', () => {
    loaderServiceMock.show();
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('.loading-text');
    expect(text.textContent).toContain('Cargando...');
  });
});
