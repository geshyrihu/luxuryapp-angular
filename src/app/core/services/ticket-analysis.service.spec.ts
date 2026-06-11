import { TestBed } from '@angular/core/testing';
import { TicketAnalysisService } from './ticket-analysis.service';
import { ApiResponseService } from './api-response.service';

describe('TicketAnalysisService', () => {
  let service: TicketAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketAnalysisService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(TicketAnalysisService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
