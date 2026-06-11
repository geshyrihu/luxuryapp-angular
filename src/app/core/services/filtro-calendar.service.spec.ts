import { TestBed } from '@angular/core/testing';
import { FiltroCalendarService } from './filtro-calendar.service';
import { DateService } from './date.service';

describe('FiltroCalendarService', () => {
  let service: FiltroCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FiltroCalendarService,
        { provide: DateService, useValue: {} },
      ],
    });
    service = TestBed.inject(FiltroCalendarService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
