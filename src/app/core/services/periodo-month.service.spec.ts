import { TestBed } from '@angular/core/testing';
import { PeriodMonthService } from './periodo-month.service';

describe('PeriodMonthService', () => {
  let service: PeriodMonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeriodMonthService],
    });
    service = TestBed.inject(PeriodMonthService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
