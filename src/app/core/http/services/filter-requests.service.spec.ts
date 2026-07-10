import { TestBed } from '@angular/core/testing';
import { FilterRequestsService } from './filter-requests.service';

describe('FilterRequestsService', () => {
  let service: FilterRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterRequestsService],
    });
    service = TestBed.inject(FilterRequestsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
