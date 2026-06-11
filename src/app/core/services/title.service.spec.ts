import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    TestBed.configureTestingModule({
      providers: [
        TitleService,
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
        { provide: ActivatedRoute, useValue: { snapshot: { data: {} }, params: new Subject(), queryParams: new Subject() } },
      ],
    });
    service = TestBed.inject(TitleService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
