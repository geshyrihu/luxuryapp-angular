import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { CandidateRecruitmentInterviewsService } from './candidate-recruitment-interviews.service';

describe('CandidateRecruitmentInterviewsService', () => {
  let service: CandidateRecruitmentInterviewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CandidateRecruitmentInterviewsService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]), onPost: vi.fn().mockResolvedValue(true) } },
      ],
    });
    service = TestBed.inject(CandidateRecruitmentInterviewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return board list', async () => {
    const result = await service.getBoard();
    expect(result).toEqual([]);
  });
});
