import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationGestureService } from './navigation-gesture.service';

describe('NavigationGestureService', () => {
  let service: NavigationGestureService;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    TestBed.configureTestingModule({
      providers: [
        NavigationGestureService,
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
      ],
    });
    service = TestBed.inject(NavigationGestureService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
