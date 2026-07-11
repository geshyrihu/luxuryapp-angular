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
import { ApplicationRole } from "../../interfaces/asp-net-roles.enum";
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

  getUserRoles(): string[] {
    return (Object.values(ApplicationRole) as ApplicationRole[]).filter((role) =>
      this.roleChecks[role](),
    );
  }
}
