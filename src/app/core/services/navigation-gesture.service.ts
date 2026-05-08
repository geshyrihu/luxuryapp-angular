/**
 * 🧞‍♂️ NavigationGestureService — El domador de gestos rebeldes 🖐️💨
 *
 * Antes, los usuarios podían deslizar desde el borde izquierdo y sin querer
 * ¡retroceder a la pantalla de login! 😱
 * Este servicio nació para poner orden en ese caos táctil.
 *
 * 🌪️ ¿Qué hace exactamente?
 *   - Escucha cada cambio de navegación (`NavigationEnd`).
 *   - Detecta si vienes desde el login (o si acabas de iniciar la app).
 *   - Si es así, **desactiva la navegación por gestos** (swipe back).
 *   - Cuando ya estás dentro de la app, **vuelve a habilitarlos**.
 *
 * ✨ Beneficios:
 *   - Evita cierres accidentales o navegación no deseada al iniciar sesión.
 *   - Mejora la experiencia PWA en móviles.
 *   - Ofrece control fino sobre el comportamiento táctil del navegador.
 *
 * 📱 En resumen:
 *   Este servicio es el guardaespaldas invisible de tu UX móvil.
 *   Nadie lo nota, pero todos disfrutan de su trabajo. 😎
 */
import { effect, inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class NavigationGestureService {
  // 🧭 Inyectamos el Router para saber por dónde navega el usuario
  private router = inject(Router);

  // --- Estado de Navegación ---
  // Guardamos la URL anterior para saber de dónde venimos. Es la clave para la lógica.
  private previousUrl: string | null = null;
  // Guardamos la URL actual para tenerla de referencia en la siguiente navegación.
  private currentUrl: string = "";

  // Signal derivado de eventos de navegación
  private navUrlSignal = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects),
    ),
  );

  // --- Estado Táctil ---
  // Coordenadas X e Y del inicio del toque para calcular el gesto.
  private touchStartX: number = 0;
  private touchStartY: number = 0;

  constructor() {
    // 🚦 Efecto que reacciona a cada navegación
    effect(() => {
      const newUrl = this.navUrlSignal();
      if (newUrl) {
        // 1. La URL que era 'actual' ahora es la 'anterior'.
        this.previousUrl = this.currentUrl;
        // 2. La nueva URL del evento es la 'actual'.
        this.currentUrl = newUrl;
        // 3. Con el historial actualizado, decidimos si los gestos deben estar activos o no.
        this.updateGestureNavigation();
      }
    });
  }

  /**
   * 🔄 El cerebro de la operación: decide si habilitar o deshabilitar los gestos.
   * Se llama después de CADA navegación.
   */
  private updateGestureNavigation(): void {
    // Si la navegación anterior fue desde el login, desactivamos los gestos.
    if (this.isFromLogin()) {
      this.disableGestureNavigation();
    } else {
      // Si venimos de cualquier otra página, los gestos se permiten.
      this.enableGestureNavigation();
    }
  }

  /**
   * 🕵️‍♂️ Comprueba si la navegación se originó en la pantalla de login.
   * También devuelve `true` si es la primera navegación de la app (`previousUrl` es `null`),
   * que suele ser el login.
   */
  private isFromLogin(): boolean {
    return (
      this.previousUrl?.includes("auth/login") || // Ruta de login principal
      this.previousUrl?.includes("/login") || // Posible alias o ruta antigua
      this.previousUrl === null // El inicio de los tiempos (primera carga)
    );
  }

  /**
   * 🚫 DESACTIVA la navegación por gestos (el "swipe back").
   * Esto se hace añadiendo listeners que interceptan y anulan el gesto.
   */
  private disableGestureNavigation(): void {
    // `overscroll-behavior: none` evita el "rebote" elástico en iOS/Android,
    // que puede ser molesto.
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    // Añadimos nuestros propios espías táctiles al documento.
    this.adDTOuchListeners();
  }

  /**
   * ✅ HABILITA la navegación por gestos, volviendo al comportamiento normal.
   * Esto se hace simplemente eliminando nuestros listeners.
   */
  private enableGestureNavigation(): void {
    // Devolvemos el comportamiento de overscroll a su estado natural.
    document.body.style.overscrollBehavior = "auto";
    document.documentElement.style.overscrollBehavior = "auto";

    // Quitamos nuestros espías. El navegador vuelve a tomar el control total.
    this.removeTouchListeners();
  }

  /**
   * 📍 Listener para `touchstart`: Guarda el punto de inicio del toque.
   * Es como poner una bandera donde el dedo aterriza.
   */
  private handleTouchStart = (e: TouchEvent): void => {
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  };

  /**
   * 🧠 Listener para `touchmove`: El núcleo de la prevención.
   * Analiza el gesto en tiempo real para ver si es un "swipe back" no deseado.
   */
  private handleTouchMove = (e: TouchEvent): void => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;

    // Calculamos la diferencia entre el inicio y la posición actual.
    const diffX = touchCurrentX - this.touchStartX;
    const diffY = Math.abs(touchCurrentY - this.touchStartY);

    // --- La Lógica de Bloqueo ---
    // 1. `this.touchStartX < 50`: El toque empezó en el borde izquierdo (los primeros 50px).
    // 2. `diffX > 50`: El dedo se ha movido más de 50px hacia la derecha (es un swipe, no un toque).
    // 3. `diffY < 50`: El movimiento es principalmente horizontal, no un scroll vertical.
    // 4. `this.isFromLogin()`: ¡La condición más importante! Solo bloqueamos si venimos del login.
    if (
      this.touchStartX < 50 &&
      diffX > 50 &&
      diffY < 50 &&
      this.isFromLogin()
    ) {
      // Si todas las condiciones se cumplen, ¡detenemos el evento!
      // Esto evita que el navegador ejecute su acción por defecto (navegar hacia atrás).
      e.preventDefault();
    }
  };
  /**
   * 🪄 Agrega los listeners al documento.
   * Usamos `{ passive: false }` para indicarle al navegador que PODRÍAMOS llamar a `preventDefault()`.
   * Sin esto, el navegador podría ignorar nuestra llamada para optimizar el rendimiento.
   */
  private adDTOuchListeners(): void {
    document.addEventListener("touchstart", this.handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleTouchMove, {
      passive: false,
    });
  }

  /**
   * 🧹 Limpia los listeners para restaurar el comportamiento normal.
   * Es importante limpiar para no dejar listeners huérfanos.
   */
  private removeTouchListeners(): void {
    document.removeEventListener("touchstart", this.handleTouchStart);
    document.removeEventListener("touchmove", this.handleTouchMove);
  }
}









