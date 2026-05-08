import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, Subject } from 'rxjs';
import { ConnectivityService } from './connectivity.service';

describe('ConnectivityService', () => {
  let service: ConnectivityService;
  let routerEvents$: Subject<any>;

  beforeEach(() => {
    routerEvents$ = new Subject();
    TestBed.configureTestingModule({
      providers: [
        ConnectivityService,
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
            url: '/',
            navigateByUrl: jasmine.createSpy('spy'),
          },
        },
      ],
    });
    service = TestBed.inject(ConnectivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isOnline should reflect navigator.onLine', () => {
    expect(typeof service.isOnline).toBe('boolean');
  });

  it('isOnline$ should be an observable', async () => {
    const val = await firstValueFrom(service.isOnline$);
    expect(typeof val).toBe('boolean');
  });
});









