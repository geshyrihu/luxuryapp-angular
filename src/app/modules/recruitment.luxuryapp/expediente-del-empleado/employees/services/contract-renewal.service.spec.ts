import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { ContractRenewalService } from './contract-renewal.service';

describe('ContractRenewalService', () => {
  let service: ContractRenewalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContractRenewalService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]), onGetItem: vi.fn().mockResolvedValue(null), onPost: vi.fn().mockResolvedValue(null) } },
      ],
    });
    service = TestBed.inject(ContractRenewalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clear store', () => {
    service.clearStore();
    expect(service.renewals()).toEqual([]);
    expect(service.selectedRenewal()).toBeNull();
    expect(service.isLoading()).toBeFalse();
  });

  it('should compute pending renewals', () => {
    service.setRenewals([
      { id: '1', status: 'EnAnalisis' } as any,
      { id: '2', status: 'Decidido' } as any,
    ]);
    expect(service.pendingRenewals().length).toBe(1);
    expect(service.decidedRenewals().length).toBe(1);
  });
});
