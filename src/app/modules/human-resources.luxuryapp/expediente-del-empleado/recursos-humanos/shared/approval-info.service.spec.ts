import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { ApprovalInfoService } from './approval-info.service';

describe('ApprovalInfoService', () => {
  let service: ApprovalInfoService;

  const mockApiResponseService = {
    onGetItem: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApprovalInfoService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
      ],
    });

    service = TestBed.inject(ApprovalInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getLeaveRequestHistorySummary', async () => {
    const mockResult = { totalDays: 5 };
    mockApiResponseService.onGetItem.mockResolvedValue(mockResult);

    const result = await service.getLeaveRequestHistorySummary('emp-1');

    expect(mockApiResponseService.onGetItem).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('should call getVacationBalance', async () => {
    const mockResult = { balance: 10 };
    mockApiResponseService.onGetItem.mockResolvedValue(mockResult);

    const result = await service.getVacationBalance('emp-1');

    expect(mockApiResponseService.onGetItem).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});

