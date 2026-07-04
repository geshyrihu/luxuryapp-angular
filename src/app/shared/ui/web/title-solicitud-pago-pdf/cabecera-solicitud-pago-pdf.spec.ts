import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CabeceraSolicitudPagoPdf } from './cabecera-solicitud-pago-pdf';
import { ApiResponseService } from '../../services/api-response.service';
import { CustomerIdService } from '../../services/customer-id.service';
import { signal } from '@angular/core';
import { vi } from 'vitest';

const customerIdServiceMock = {
  customerId: signal(0),
};

const apiResponseServiceMock = {
  onGetList: vi.fn().mockResolvedValue({ id: 1, name: 'Test Customer' }),
};

describe('CabeceraSolicitudPagoPdf', () => {
  let component: CabeceraSolicitudPagoPdf;
  let fixture: ComponentFixture<CabeceraSolicitudPagoPdf>;

  beforeEach(async () => {
    TestBed.overrideComponent(CabeceraSolicitudPagoPdf, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
        styleUrls: [],
      },
    });

    await TestBed.configureTestingModule({
      imports: [CabeceraSolicitudPagoPdf],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CustomerIdService, useValue: customerIdServiceMock },
        { provide: ApiResponseService, useValue: apiResponseServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CabeceraSolicitudPagoPdf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty titulo by default', () => {
    expect(component.titulo()).toBe('');
  });

  it('should have empty folio by default', () => {
    expect(component.folio()).toBe('');
  });

  it('should have empty factura by default', () => {
    expect(component.factura()).toBe('');
  });
});
