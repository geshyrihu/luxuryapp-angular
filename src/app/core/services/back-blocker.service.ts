import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs";

/**
 * 🛡️ BackBlockerService — El Guardián del Botón "Atrás"
 * ... (comentarios preservados)
 */

@Injectable({ providedIn: "root" })
export class BackBlockerService {
  private router = inject(Router);

  // Guardamos la última URL visitada para tener contexto.
  // Transformamos el flujo de eventos en un Signal.
  private lastUrlSignal = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    // Escuchamos el evento `popstate` del historial del navegador.
    window.addEventListener("popstate", this.onPopState, { passive: false });
  }

  // Getter para compatibilidad o uso interno
  private get lastUrl(): string | undefined {
    return this.lastUrlSignal();
  }

  /**
   * Se ejecuta cada vez que el usuario presiona el botón "Atrás" del navegador.
   */
  private onPopState = (ev: PopStateEvent) => {
    // --- Lógica de Detección ---
    // Cuando `popstate` se dispara, el `history.state` ya es el del destino.
    // 1. `this.lastUrl?.includes("/auth/login")`: Comprueba si la página DESDE la que
    //    se navega es el login. Esto es para evitar bucles si el usuario está en el login
    //    y presiona atrás. (Nota: esta condición puede ser conflictiva y a veces se retira).
    // 2. `!window.history.state` o `window.history.state.navigationId <= 1`:
    //    Esta es la comprobación clave. Si el estado de destino no existe o tiene un `navigationId`
    //    muy bajo, es muy probable que sea la página de login inicial.
    const goingToLogin =
      this.lastUrl?.includes("/auth/login") ||
      !window.history.state ||
      window.history.state.navigationId <= 1;

    if (goingToLogin) {
      // `preventDefault()` no funciona aquí, pero se deja por si algún navegador futuro lo soporta.
      ev.preventDefault?.();

      // --- La Magia del Redireccionamiento ---
      // Como no podemos cancelar, forzamos una nueva navegación.
      // 1. Llevamos al usuario a una ruta segura (el dashboard).
      //    `replaceUrl: true` evita que esta "corrección" se añada al historial.
      this.router.navigate(["/dashboard"], { replaceUrl: true });

      // 2. Empujamos un estado manualmente en el historial. Esto ayuda a estabilizar
      //    el historial del navegador después de nuestra redirección forzada,
      //    evitando que un segundo "atrás" cause problemas.
      history.pushState({ ng: true }, "", this.router.url);
    }
  };
}









