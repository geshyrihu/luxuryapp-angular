import { TestBed } from '@angular/core/testing';
import { CobranzaOnlineStoreService } from './cobranza-online-store.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';

describe('CobranzaOnlineStoreService', () => {
  let service: CobranzaOnlineStoreService;

  const mockApiResponseService = {
    onGetItem: vi.fn().mockResolvedValue(null),
    onPost: vi.fn().mockResolvedValue(null),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CobranzaOnlineStoreService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });
    service = TestBed.inject(CobranzaOnlineStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear store', () => {
    service.clearStore();
    expect(service.dashboardData()).toBeNull();
  });
});
