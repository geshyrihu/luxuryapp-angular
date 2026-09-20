import { TestBed } from '@angular/core/testing';
import { ReportFilterService } from './financial-report-filter.service';

describe('ReportFilterService', () => {
  let service: ReportFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportFilterService],
    });
    service = TestBed.inject(ReportFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default year signal', () => {
    expect(service.year()).toBeDefined();
  });
});
