/**
 * 🧭 NavigationService — El guardián del historial de rutas 💾
 *
 * Este pequeño pero valiente servicio mantiene un historial interno de todas las rutas
 * por las que el usuario ha navegado dentro de la aplicación.
 *
 * 💡 ¿Por qué no usar directamente el historial del navegador?
 *    Porque Angular (especialmente en modo PWA o apps embebidas) no siempre permite un control fino
 *    del stack de navegación. Con este servicio podemos tener una capa de control *propia y confiable*.
 *
 * 🔍 Funcionalidades principales:
 *   - 📜 Registrar cada URL que el usuario visita (gracias a `NavigationEnd`).
 *   - 🔙 Obtener la ruta anterior con `getPreviousUrl()`.
 *   - 🚫 Saber si realmente se puede "volver atrás" (sin caer en login loops o rutas restringidas).
 *
 * 🧠 Uso típico:
 *   - En botones tipo “Volver” (`Back`) dentro de la UI.
 *   - Para decidir dinámicamente si mostrar o no un botón de retroceso.
 *   - Para redirigir al usuario a su página anterior después de una acción.
 *
 * ✨ Ejemplo de uso en un componente:
 *   ```ts
 *   constructor(private navigationService: NavigationService, private router: Router) {}
 *
 *   goBack() {
 *     if (this.navigationService.canGoBack()) {
 *       this.location.back(); // O usar this.navigationService.getPreviousUrl()
 *     } else {
 *       // Si no hay a dónde ir, lo mandamos a un lugar seguro.
 *       this.router.navigateByUrl('/dashboard');
 *     }
 *   }
 *   ```
 */
import { effect, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  // 🗂️ Guarda el historial completo de URLs visitadas (en orden de navegación).
  private history: string[] = [];

  // Signal derivado de eventos de navegación exitosos
  private navEnd = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
  );

  constructor(private router: Router) {
    // 👂 Efecto que reacciona a cada navegación y actualiza el historial
    effect(() => {
      const url = this.navEnd();
      if (url) {
        this.history.push(url);
      }
    });
  }

  /**
   * 🔙 Devuelve la URL anterior (si existe).
   * Si el historial tiene al menos 2 entradas (la actual y la anterior),
   * retorna la penúltima. Si no, devuelve `null`.
   */
  getPreviousUrl(): string | null {
    return this.history.length > 1
      ? this.history[this.history.length - 2]
      : null;
  }

  /**
   * 🚦 Determina si se puede "volver atrás" de forma segura desde la UI.
   * Su principal trabajo es evitar que un botón "Volver" lleve al usuario
   * de nuevo a la pantalla de login, lo que rompería el flujo de la app.
   */
  canGoBack(): boolean {
    const previousUrl = this.getPreviousUrl();
    return (
      previousUrl !== null && // ¿Hay una URL anterior?
      !previousUrl.includes("auth/login") && // ¿No es la de login?
      !previousUrl.includes("/login") // ¿Tampoco es un alias de login?
    );
  }
}









