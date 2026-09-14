import { TestBed } from '@angular/core/testing';
import { CommitteeCobranzaBaseService } from './committee-cobranza-base.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';

describe('CommitteeCobranzaBaseService', () => {
  let service: CommitteeCobranzaBaseService;

  const mockApiResponseService = {
    onGetItem: vi.fn().mockResolvedValue(null),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommitteeCobranzaBaseService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });
    service = TestBed.inject(CommitteeCobranzaBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null avanceCobranza initially', () => {
    expect(service.avanceCobranza()).toBeNull();
  });
});
