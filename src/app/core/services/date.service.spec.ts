import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });
    service = TestBed.inject(DateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
