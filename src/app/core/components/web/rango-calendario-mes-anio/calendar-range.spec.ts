import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarRange } from './calendar-range';
import { DateService } from '../../services/date.service';
import { FiltroCalendarService } from '../../services/filtro-calendar.service';

describe('CalendarRange', () => {
  let component: CalendarRange;
  let fixture: ComponentFixture<CalendarRange>;
  let filtroService: FiltroCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendarRange],
      providers: [
        FiltroCalendarService,
        {
          provide: DateService,
          useValue: {
            onParseToInputMonth: vi.fn((date: Date) => {
              const mm = date.getMonth() + 1;
              return [date.getFullYear(), (mm > 9 ? '' : '0') + mm].join('-');
            }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(CalendarRange);
    component = fixture.componentInstance;
    filtroService = TestBed.inject(FiltroCalendarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SetFechasMonth on onSendDateRange', () => {
    const spy = vi.spyOn(filtroService, 'SetFechasMonth');
    component.onSendDateRange('2026-01', '2026-12');
    expect(spy).toHaveBeenCalledWith('2026-01', '2026-12');
  });
});
