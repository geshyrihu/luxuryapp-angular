import { TestBed } from '@angular/core/testing';
import { AiService } from './ai.service';
import { ApiResponseService } from './api-response.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AiService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(AiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
