import { TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CustomerIdService } from 'src/app/core/auth/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { ApprovalStateService } from './approval-state.service';
import { of } from 'rxjs';

describe('ApprovalStateService', () => {
  let service: ApprovalStateService;

  const mockApiResponseService = {
    onGetList: vi.fn(),
    onPut: vi.fn(),
  };

  const mockAuthService = {
    userRole$: of('SuperUsuario'),
  };

  const mockCustomerIdService = {
    customerId: vi.fn().mockReturnValue('cust-1'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApprovalStateService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CustomerIdService, useValue: mockCustomerIdService },
      ],
    });

    service = TestBed.inject(ApprovalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial state', () => {
    expect(service.loading()).toBe(true);
    expect(service.requests()).toEqual([]);
    expect(service.error()).toBeNull();
  });

  it('should call loadRequests and update state', async () => {
    mockApiResponseService.onGetList.mockResolvedValue([
      { id: '1', requestDate: '2026-01-01' },
    ]);

    await service.loadRequests();

    expect(service.loading()).toBe(false);
    expect(service.requests().length).toBeGreaterThanOrEqual(0);
  });
});
