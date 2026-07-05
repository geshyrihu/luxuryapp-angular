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
import { EApplicationRole } from "../enums/asp-net-roles.enum";
import { AuthService } from "./auth.service";
// 🔹 Tipo helper: Mapea cada rol a un signal booleano
type RoleSignalsMap = { [K in EApplicationRole]: WritableSignal<boolean> };

@Injectable({ providedIn: "root" })
export class AspRoleService {
  // 🔹 Inyectamos AuthService para obtener los roles actuales del usuario
  private readonly authS = inject(AuthService);

  // 🔹 Referencia de destrucción para limpiar suscripciones automáticamente
  private readonly destroyRef = inject(DestroyRef);

  // 🔹 Creamos un mapa reactivo (signals) por cada rol
  // Inicializamos todos los roles en `false` para evitar undefined
  public readonly roleChecks: RoleSignalsMap = Object.values(
    EApplicationRole,
  ).reduce((acc, role) => {
    acc[role] = signal(false);
    return acc;
  }, {} as RoleSignalsMap);

  constructor() {
    // 🔹 Nos suscribimos a cambios en el token de usuario
    // Esto permite actualizar dinámicamente qué roles tiene el usuario
    this.authS.userToken$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((session) => {
        // 🔹 Convertimos los roles del usuario en un Set para búsqueda rápida
        const current = new Set(session?.roles ?? []);

        // 🔹 Iteramos todos los roles y actualizamos su signal
        // Solo actualizamos si el valor cambió para evitar renders innecesarios
        for (const role of Object.values(EApplicationRole)) {
          const sig = this.roleChecks[role];
          const next = current.has(role);
          if (sig() !== next) sig.set(next);
        }
      });
  }

  // 🔹 Devuelve la señal de un rol específico
  // Útil para plantillas Angular: @if (aspRoleS.roleSignal(AspRole.Comite)())
  roleSignal(role: EApplicationRole): Signal<boolean> {
    return this.roleChecks[role];
  }

  // 🔹 Lectura inmediata del valor de un rol
  // Útil para lógica imperativa en componentes TS
  hasRole(role: EApplicationRole): boolean {
    return this.roleChecks[role]();
  }

  // 🔹 Verifica si el usuario tiene alguno de los roles pasados
  // Útil para lógica de permisos rápida en código TS
  hasAny(roles: EApplicationRole[]): boolean {
    return roles.some((r) => this.roleChecks[r]());
  }

  // 🔹 Computed signal que devuelve true si el usuario tiene cualquiera de los roles
  // Ideal para usar en plantillas de Angular con un conjunto fijo de roles
  anyOf = (roles: EApplicationRole[]) =>
    computed(() => roles.some((r) => this.roleChecks[r]()));

  // 🔹 Devuelve un array con los roles actuales del usuario
  // Útil para mostrar información de roles o filtrar opciones
  getUserRoles(): string[] {
    return Object.values(EApplicationRole).filter((role) =>
      this.roleChecks[role](),
    );
  }
}
