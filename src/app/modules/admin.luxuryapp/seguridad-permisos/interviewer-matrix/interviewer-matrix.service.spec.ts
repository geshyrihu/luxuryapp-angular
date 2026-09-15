import { TestBed } from '@angular/core/testing';
import { InterviewerMatrixService } from './interviewer-matrix.service';
import { ApiResponseService } from '@core/http/services/api-response.service';

describe('InterviewerMatrixService', () => {
  let service: InterviewerMatrixService;

  const mockApiResponseService = {
    onGetItem: vi.fn().mockResolvedValue(null),
    onPost: vi.fn().mockResolvedValue(null),
    onPut: vi.fn().mockResolvedValue(null),
    onDelete: vi.fn().mockResolvedValue(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InterviewerMatrixService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
      ],
    });
    service = TestBed.inject(InterviewerMatrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api getByCustomer', () => {
    service.getByCustomer('cust1');
    expect(mockApiResponseService.onGetItem).toHaveBeenCalled();
  });
});

