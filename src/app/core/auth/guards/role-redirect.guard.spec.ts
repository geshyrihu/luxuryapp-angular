import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AspRoleService } from '../services/asp-role.service';
import { ApplicationRole } from '../../enums/asp-net-roles.enum';
import { roleRedirectGuard } from './role-redirect.guard';

describe('roleRedirectGuard', () => {
  let aspRoleMock: { hasRole: ReturnType<typeof jasmine.createSpy> };
  let routerMock: { createUrlTree: ReturnType<typeof jasmine.createSpy> };
  const dummyTree = {} as UrlTree;

  beforeEach(() => {
    aspRoleMock = { hasRole: jasmine.createSpy('hasRole') };
    routerMock = { createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue(dummyTree) };

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
    aspRoleMock.hasRole.and.callFake((role: ApplicationRole) => role === ApplicationRole.Comite);
    expect(runGuard()).toBe(dummyTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/committee']);
  });

  it('should redirect to /direccion when user has Direccion role', () => {
    aspRoleMock.hasRole.and.callFake((role: ApplicationRole) => role === ApplicationRole.Direccion);
    expect(runGuard()).toBe(dummyTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/direccion']);
  });

  it('should redirect to /dashboard when user has neither role', () => {
    aspRoleMock.hasRole.and.returnValue(false);
    expect(runGuard()).toBe(dummyTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
  });
});
