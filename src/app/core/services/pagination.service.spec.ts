import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';
import { ApiResponseService } from './api-response.service';

describe('PaginationService', () => {
  let service: PaginationService<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaginationService,
        { provide: ApiResponseService, useValue: {} },
      ],
    });
    service = TestBed.inject(PaginationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
