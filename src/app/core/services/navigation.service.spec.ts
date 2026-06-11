import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerEvents: Subject<any>;

  beforeEach(() => {
    routerEvents = new Subject();
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
      ],
    });
    service = TestBed.inject(NavigationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
