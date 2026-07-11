import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { signal } from '@angular/core';
import { ApplicationRole } from '../enums/asp-net-roles.enum';
import { AspRoleService } from '../services/asp-role.service';
import { superUserGuard } from './super-user.guard';

describe('superUserGuard', () => {
  let aspRoleMock: { roleSignal: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/admin/config' } as RouterStateSnapshot;

  beforeEach(() => {
    aspRoleMock = {
      roleSignal: vi.fn().mockReturnValue(signal(false)),
    };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AspRoleService, useValue: aspRoleMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => superUserGuard(mockRoute, mockState));

  it('should allow access when user has SuperUsuario role', () => {
    aspRoleMock.roleSignal.mockImplementation((role: ApplicationRole) =>
      signal(role === ApplicationRole.SuperUsuario),
    );
    expect(runGuard()).toBe(true);
  });

  it('should allow access when user has Legal role', () => {
    aspRoleMock.roleSignal.mockImplementation((role: ApplicationRole) =>
      signal(role === ApplicationRole.Legal),
    );
    expect(runGuard()).toBe(true);
  });

  it('should allow access when user has RecursosHumanos role', () => {
    aspRoleMock.roleSignal.mockImplementation((role: ApplicationRole) =>
      signal(role === ApplicationRole.RecursosHumanos),
    );
    expect(runGuard()).toBe(true);
  });

  it('should allow access when user has Reclutamiento role', () => {
    aspRoleMock.roleSignal.mockImplementation((role: ApplicationRole) =>
      signal(role === ApplicationRole.Reclutamiento),
    );
    expect(runGuard()).toBe(true);
  });

  it('should deny access and redirect when user has none of the authorized roles', () => {
    aspRoleMock.roleSignal.mockReturnValue(signal(false));
    expect(runGuard()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should deny access when no session exists', () => {
    aspRoleMock.roleSignal.mockReturnValue(signal(false));
    expect(runGuard()).toBe(false);
  });

  it('should check all four authorized roles', () => {
    runGuard();
    expect(aspRoleMock.roleSignal).toHaveBeenCalledWith(ApplicationRole.SuperUsuario);
    expect(aspRoleMock.roleSignal).toHaveBeenCalledWith(ApplicationRole.Legal);
    expect(aspRoleMock.roleSignal).toHaveBeenCalledWith(ApplicationRole.RecursosHumanos);
    expect(aspRoleMock.roleSignal).toHaveBeenCalledWith(ApplicationRole.Reclutamiento);
  });
});
