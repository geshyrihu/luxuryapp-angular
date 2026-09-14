import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { EmployeeInterviewerQueueService } from './employee-interviewer-queue.service';

describe('EmployeeInterviewerQueueService', () => {
  let service: EmployeeInterviewerQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeInterviewerQueueService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]), onPost: vi.fn().mockResolvedValue(true) } },
      ],
    });
    service = TestBed.inject(EmployeeInterviewerQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return queue for customer', async () => {
    const result = await service.getQueue('cust-1');
    expect(result).toEqual([]);
  });
});
