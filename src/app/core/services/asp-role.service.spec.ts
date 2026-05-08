import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EApplicationRole } from '../enums/asp-net-roles.enum';
import { AspRoleService } from './asp-role.service';
import { AuthService } from './auth.service';

describe('AspRoleService', () => {
  let service: AspRoleService;
  let userToken$: BehaviorSubject<any>;

  beforeEach(() => {
    userToken$ = new BehaviorSubject<any>(null);

    TestBed.configureTestingModule({
      providers: [
        AspRoleService,
        {
          provide: AuthService,
          useValue: { userToken$ },
        },
      ],
    });
    service = TestBed.inject(AspRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for all roles when no session exists', () => {
    expect(service.hasRole(EApplicationRole.Comite)).toBe(false);
    expect(service.hasRole(EApplicationRole.SuperUsuario)).toBe(false);
  });

  it('should return true for a role the user has', () => {
    userToken$.next({ roles: [EApplicationRole.Comite] });
    expect(service.hasRole(EApplicationRole.Comite)).toBe(true);
  });

  it('should return false for a role the user does NOT have', () => {
    userToken$.next({ roles: [EApplicationRole.Comite] });
    expect(service.hasRole(EApplicationRole.SuperUsuario)).toBe(false);
  });

  it('hasAny() should return true if user has at least one of the roles', () => {
    userToken$.next({ roles: [EApplicationRole.Comite] });
    expect(service.hasAny([EApplicationRole.Comite, EApplicationRole.SuperUsuario])).toBe(true);
  });

  it('hasAny() should return false if user has none of the roles', () => {
    userToken$.next({ roles: [EApplicationRole.Administrador] });
    expect(service.hasAny([EApplicationRole.Comite, EApplicationRole.SuperUsuario])).toBe(false);
  });

  it('roleSignal() should return a reactive signal', () => {
    const sig = service.roleSignal(EApplicationRole.Comite);
    expect(sig()).toBe(false);
    userToken$.next({ roles: [EApplicationRole.Comite] });
    expect(sig()).toBe(true);
  });

  it('should update signals when user session changes', () => {
    userToken$.next({ roles: [EApplicationRole.Comite] });
    expect(service.hasRole(EApplicationRole.Comite)).toBe(true);

    userToken$.next({ roles: [] });
    expect(service.hasRole(EApplicationRole.Comite)).toBe(false);
  });
});









