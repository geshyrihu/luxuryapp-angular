import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { BackBlockerService } from './back-blocker.service';

describe('BackBlockerService', () => {
  let service: BackBlockerService;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    TestBed.configureTestingModule({
      providers: [
        BackBlockerService,
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
      ],
    });
    service = TestBed.inject(BackBlockerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
