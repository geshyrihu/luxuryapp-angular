import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ApplicationRole } from "../../enums/asp-net-roles.enum";
import { AuthService } from "./auth.service";

type RoleSignalsMap = { [K in ApplicationRole]: WritableSignal<boolean> };

@Injectable({ providedIn: "root" })
export class AspRoleService {
  private readonly authS = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly roleChecks: RoleSignalsMap = (Object.values(
    ApplicationRole,
  ) as ApplicationRole[]).reduce((acc, role) => {
    acc[role] = signal(false);
    return acc;
  }, {} as RoleSignalsMap);

  constructor() {
    this.authS.userToken$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((session) => {
        const current = new Set(session?.roles ?? []);

        for (const role of Object.values(ApplicationRole) as ApplicationRole[]) {
          const sig = this.roleChecks[role];
          const next = current.has(role);
          if (sig() !== next) sig.set(next);
        }
      });
  }

  roleSignal(role: ApplicationRole): Signal<boolean> {
    return this.roleChecks[role];
  }

  hasRole(role: ApplicationRole): boolean {
    return this.roleChecks[role]();
  }

  hasAny(roles: ApplicationRole[]): boolean {
    return roles.some((r) => this.roleChecks[r]());
  }

  anyOf = (roles: ApplicationRole[]) =>
    computed(() => roles.some((r) => this.roleChecks[r]()));

  /**
   * SuperUsuario y Direccion están exentos de todo candado de rol (guards y
   * visibilidad de UI). Los métodos `hasRole`/`hasAny`/`anyOf`/`roleSignal` de
   * arriba NO deben cambiar: reflejan la pertenencia real al rol y los usa
   * lógica de identidad/routing (ej. roleRedirectGuard) que se rompería si
   * mintieran. Usar `canAccess*` en su lugar para candados de acceso.
   */
  private readonly exemptRoles: ApplicationRole[] = [
    ApplicationRole.SuperUsuario,
    ApplicationRole.Direccion,
  ];

  isExempt(): boolean {
    return this.hasAny(this.exemptRoles);
  }

  canAccess(role: ApplicationRole): boolean {
    return this.isExempt() || this.hasRole(role);
  }

  canAccessAny(roles: ApplicationRole[]): boolean {
    return this.isExempt() || this.hasAny(roles);
  }

  canAccessSignal(role: ApplicationRole): Signal<boolean> {
    return computed(() => this.isExempt() || this.roleChecks[role]());
  }

  canAccessAnySignal = (roles: ApplicationRole[]) =>
    computed(() => this.isExempt() || roles.some((r) => this.roleChecks[r]()));

  getUserRoles(): string[] {
    return (Object.values(ApplicationRole) as ApplicationRole[]).filter((role) =>
      this.roleChecks[role](),
    );
  }
}
