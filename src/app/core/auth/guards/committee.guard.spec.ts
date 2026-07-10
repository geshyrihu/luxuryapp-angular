import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { EApplicationRole } from '../enums/asp-net-roles.enum';
import { AuthService } from '../services/auth.service';
import { committeeGuard } from './committee.guard';

describe('committeeGuard', () => {
  let authServiceMock: {
    initialAuthCheckCompleted$: BehaviorSubject<boolean>;
    userToken$: BehaviorSubject<any>;
  };
  let routerMock: { createUrlTree: ReturnType<typeof jasmine.createSpy> };
  const fakeUrlTree = { toString: () => '/auth/login' } as unknown as UrlTree;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/committee/dashboard' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      initialAuthCheckCompleted$: new BehaviorSubject<boolean>(true),
      userToken$: new BehaviorSubject<any>(null),
    };
    routerMock = { createUrlTree: jasmine.createSpy('spy').and.returnValue(fakeUrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => committeeGuard(mockRoute, mockState));

  it('should allow access when user has Comite role', async () => {
    authServiceMock.userToken$.next({ roles: [EApplicationRole.Comite] });
    const result = await firstValueFrom(runGuard() as Observable<boolean | UrlTree>);
    expect(result).toBe(true);
  });

  it('should redirect to login when user does not have Comite role', async () => {
    authServiceMock.userToken$.next({ roles: [EApplicationRole.Administrador] });
    const result = await firstValueFrom(runGuard() as Observable<boolean | UrlTree>);
    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should redirect when user has no roles', async () => {
    authServiceMock.userToken$.next({ roles: [] });
    const result = await firstValueFrom(runGuard() as Observable<boolean | UrlTree>);
    expect(result).not.toBe(true);
  });
});









