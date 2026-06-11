import { TestBed } from '@angular/core/testing';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportService],
    });
    service = TestBed.inject(ReportService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
