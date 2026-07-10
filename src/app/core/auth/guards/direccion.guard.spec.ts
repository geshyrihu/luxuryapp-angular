import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { EApplicationRole } from '../enums/asp-net-roles.enum';
import { AuthService } from '../services/auth.service';
import { direccionGuard } from './direccion.guard';

describe('direccionGuard', () => {
  let authServiceMock: {
    initialAuthCheckCompleted$: BehaviorSubject<boolean>;
    userToken$: BehaviorSubject<any>;
  };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };
  const fakeUrlTree = {
    toString: () => '/unauthorized',
  } as unknown as UrlTree;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/direccion/dashboard' } as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      initialAuthCheckCompleted$: new BehaviorSubject<boolean>(true),
      userToken$: new BehaviorSubject<any>(null),
    };
    routerMock = { createUrlTree: vi.fn().mockReturnValue(fakeUrlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => direccionGuard(mockRoute, mockState));

  it('should allow access when user has Direccion role', async () => {
    authServiceMock.userToken$.next({ roles: [EApplicationRole.Direccion] });
    const result = await firstValueFrom(
      runGuard() as Observable<boolean | UrlTree>,
    );
    expect(result).toBe(true);
  });

  it('should redirect to unauthorized when user does not have Direccion role', async () => {
    authServiceMock.userToken$.next({ roles: [EApplicationRole.Comite] });
    const result = await firstValueFrom(
      runGuard() as Observable<boolean | UrlTree>,
    );
    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should redirect when user has no roles', async () => {
    authServiceMock.userToken$.next({ roles: [] });
    const result = await firstValueFrom(
      runGuard() as Observable<boolean | UrlTree>,
    );
    expect(result).not.toBe(true);
  });

  it('should redirect when no session exists', async () => {
    authServiceMock.userToken$.next(null);
    const result = await firstValueFrom(
      runGuard() as Observable<boolean | UrlTree>,
    );
    expect(result).not.toBe(true);
  });
});
