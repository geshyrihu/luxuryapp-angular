import { TestBed } from '@angular/core/testing';
import { GlobalTableFilterService } from './global-table-filter.service';

describe('GlobalTableFilterService', () => {
  let service: GlobalTableFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalTableFilterService],
    });
    service = TestBed.inject(GlobalTableFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and clear filter term', () => {
    service.setFilter('search term');
    expect(service.filterTerm()).toBe('search term');
    service.clear();
    expect(service.filterTerm()).toBe('');
  });
});
