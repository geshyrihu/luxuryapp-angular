import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { PageTitleReport } from './page-title-report';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { PeriodMonthService } from 'src/app/core/services/periodo-month.service';
import { DateService } from 'src/app/core/services/date.service';
import { signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Mock de Ionic
vi.mock('@ionic/angular/standalone', async () => {
  const { Component } = await import('@angular/core');
  @Component({ selector: 'ion-spinner', template: '', standalone: true }) class Mock {}
  return { IonSpinner: Mock, IonButton: Mock, IonIcon: Mock, IonItem: Mock, IonLabel: Mock, IonContent: Mock, IonList: Mock, IonPopover: Mock };
});

describe('PageTitleReport', () => {
  let component: PageTitleReport;
  let fixture: ComponentFixture<PageTitleReport>;
  let customerIdServiceMock: any;
  let apiResponseServiceMock: any;
  let dateServiceMock: any;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  beforeEach(async () => {
    customerIdServiceMock = {
      customerId: signal(''),
    };

    apiResponseServiceMock = {
      onGetItem: vi.fn().mockImplementation(() => 
        Promise.resolve({
          nameCustomer: 'Test Customer Name',
          photoPath: 'test-photo-path.png'
        })
      ),
    };

    dateServiceMock = {
      formatDateTimeToMMMMAAAA: vi.fn().mockReturnValue('Junio 2026'),
    };

    await TestBed.configureTestingModule({
      imports: [PageTitleReport],
      providers: [
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
        { provide: PeriodMonthService, useValue: { getPeriodoInicio: new Date() } },
        { provide: DateService, useValue: dateServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTitleReport);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debe cargar los datos del cliente cuando cambia el ID', async () => {
    fixture.detectChanges();
    
    customerIdServiceMock.customerId.set('new-id');
    
    await delay(50);
    fixture.detectChanges();

    expect(apiResponseServiceMock.onGetItem).toHaveBeenCalled();
    expect(component.nameCustomer()).toBe('Test Customer Name');
    expect(component.logoCustomer()).toBe('test-photo-path.png');
  });

  it('debe renderizar el título y periodo correctamente', () => {
    fixture.componentRef.setInput('title', 'Reporte de Prueba');
    fixture.componentRef.setInput('periodo', 'Mayo 2026');
    fixture.detectChanges();

    const h4 = fixture.nativeElement.querySelector('h4'); // nameCustomer (vacio inicial)
    const h6s = fixture.nativeElement.querySelectorAll('h6');

    expect(h6s[0].textContent).toContain('Reporte de Prueba');
    expect(h6s[1].textContent).toContain('Mayo 2026');
  });

  it('debe mostrar el nombre del cliente después de cargar', async () => {
    customerIdServiceMock.customerId.set('test-id');
    fixture.detectChanges();
    
    await delay(50);
    fixture.detectChanges();

    const h4 = fixture.nativeElement.querySelector('h4');
    expect(h4.textContent).toContain('Test Customer Name');
  });
});
