import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AspRoleService } from '../services/asp-role.service';
import { roleRedirectGuard } from './role-redirect.guard';

describe('roleRedirectGuard', () => {
  let aspRoleMock: { hasRole: ReturnType<typeof jasmine.createSpy> };
  let routerMock: { navigate: ReturnType<typeof jasmine.createSpy> };

  beforeEach(() => {
    aspRoleMock = { hasRole: jasmine.createSpy('spy') };
    routerMock = { navigate: jasmine.createSpy('spy') };

    TestBed.configureTestingModule({
      providers: [
        { provide: AspRoleService, useValue: aspRoleMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => roleRedirectGuard({} as any, {} as any));

  it('should redirect to /committee when user has Comite role', () => {
    aspRoleMock.hasRole.and.returnValue(true);
    expect(runGuard()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/committee'], { replaceUrl: true });
  });

  it('should redirect to /dashboard when user does NOT have Comite role', () => {
    aspRoleMock.hasRole.and.returnValue(false);
    expect(runGuard()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard'], { replaceUrl: true });
  });

  it('should always return false (it only redirects)', () => {
    aspRoleMock.hasRole.and.returnValue(true);
    expect(runGuard()).toBe(false);
    aspRoleMock.hasRole.and.returnValue(false);
    expect(runGuard()).toBe(false);
  });
});









