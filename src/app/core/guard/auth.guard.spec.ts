import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConnectivityService } from '../services/connectivity.service';
import { ConsoleLoggerService } from '../services/console-logger.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authServiceMock: {
    initialAuthCheckCompleted$: BehaviorSubject<boolean>;
    isAuthenticated$: BehaviorSubject<boolean>;
  };
  let routerMock: { navigate: ReturnType<typeof jasmine.createSpy>; getCurrentNavigation: ReturnType<typeof jasmine.createSpy> };
  let connectivityMock: { isOnline: boolean };
  let loggerMock: { custom: ReturnType<typeof jasmine.createSpy> };

  const mockRoute = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    authServiceMock = {
      initialAuthCheckCompleted$: new BehaviorSubject<boolean>(true),
      isAuthenticated$: new BehaviorSubject<boolean>(false),
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue(null),
    };
    connectivityMock = { isOnline: true };
    loggerMock = { custom: jasmine.createSpy('custom') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ConnectivityService, useValue: connectivityMock },
        { provide: ConsoleLoggerService, useValue: loggerMock },
      ],
    });
  });

  const runGuard = (url: string) => {
    const state = { url } as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => authGuard(mockRoute, state));
  };

  it('should allow access to public routes without authentication', async () => {
    const result = await firstValueFrom(runGuard('/publico/report/123') as Observable<boolean>);
    expect(result).toBe(true);
  });

  it('should block navigation when offline', async () => {
    connectivityMock.isOnline = false;
    const result = await firstValueFrom(runGuard('/dashboard') as Observable<boolean>);
    expect(result).toBe(false);
  });

  it('should allow access when authenticated', async () => {
    authServiceMock.isAuthenticated$.next(true);
    const result = await firstValueFrom(runGuard('/dashboard') as Observable<boolean>);
    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', async () => {
    authServiceMock.isAuthenticated$.next(false);
    const result = await firstValueFrom(runGuard('/dashboard') as Observable<boolean>);
    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      jasmine.objectContaining({
        queryParams: { returnUrl: '/dashboard' },
        replaceUrl: true,
      }),
    );
  });
});









