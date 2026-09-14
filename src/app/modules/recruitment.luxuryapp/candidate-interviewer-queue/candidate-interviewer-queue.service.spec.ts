import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CandidateInterviewerQueueService } from './candidate-interviewer-queue.service';

describe('CandidateInterviewerQueueService', () => {
  let service: CandidateInterviewerQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CandidateInterviewerQueueService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]), onPost: vi.fn().mockResolvedValue(true) } },
      ],
    });
    service = TestBed.inject(CandidateInterviewerQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return queue list', async () => {
    const result = await service.getInterviewerQueue();
    expect(result).toEqual([]);
  });
});
