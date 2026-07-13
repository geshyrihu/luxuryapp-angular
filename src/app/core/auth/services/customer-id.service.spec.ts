import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from "src/app/core/constants/endpoints";
import { environment } from 'src/environments/environment';
import { ConsoleLoggerService } from './console-logger.service';
import { CustomerIdService } from './customer-id.service';
import { StorageService } from './storage.service';

describe('CustomerIdService', () => {
  let service: CustomerIdService;
  let httpMock: HttpTestingController;
  let storageMock: { retrieve: ReturnType<typeof jasmine.createSpy>; store: ReturnType<typeof jasmine.createSpy>; clear: ReturnType<typeof jasmine.createSpy> };

  beforeEach(() => {
    storageMock = {
      retrieve: jasmine.createSpy('spy').and.returnValue(null),
      store: jasmine.createSpy('spy'),
      clear: jasmine.createSpy('spy'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CustomerIdService,
        { provide: StorageService, useValue: storageMock },
        { provide: ConsoleLoggerService, useValue: { custom: jasmine.createSpy('spy'), error: jasmine.createSpy('spy'), info: jasmine.createSpy('spy') } },
      ],
    });
    service = TestBed.inject(CustomerIdService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('customerId should initially be empty string', () => {
    expect(service.customerId()).toBe('');
  });

  it('customerDataReady should initially be false', () => {
    expect(service.customerDataReady()).toBe(false);
  });

  it('clearCustomerData should reset state', () => {
    service.clearCustomerData();
    expect(service.customerId()).toBe('');
    expect(service.nombreCorto()).toBe('');
    expect(service.customerDataReady()).toBe(false);
    expect(storageMock.clear).toHaveBeenCalledWith('customerId');
  });

  it('setCustomerId should not make API call for empty id', async () => {
    const result = await firstValueFrom(service.setCustomerId(''));
    expect(result).toBe(true);
  });

  it('initializeCustomerStateAfterLogin should return false for null token', async () => {
    const result = await firstValueFrom(service.initializeCustomerStateAfterLogin(null as any));
    expect(result).toBe(false);
  });

  it('initializeCustomerStateAfterLogin should load customer data with valid token', async () => {
    const mockToken = {
      infoUserAuthDTO: { customerId: 'guid-123' },
      customerAccess: [{ value: 'guid-123' }],
    };

    const resultPromise = firstValueFrom(
      service.initializeCustomerStateAfterLogin(mockToken as any),
    );

    const req = httpMock.expectOne(
      `${environment.API_BASE_URL}${Endpoints.Customers.getById(
        "guid-123",
      )}`,
    );
    req.flush({
      success: true,
      data: {
        id: 'guid-123',
        nombreCorto: 'Test Corp',
        photoPath: '/img/test.png',
        nameCustomer: 'Test Corporation',
      },
    });

    const result = await resultPromise;
    expect(result).toBe(true);
    expect(service.customerId()).toBe('guid-123');
  });
});









