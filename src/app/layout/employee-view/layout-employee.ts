import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/core/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { OneSignalService } from "src/app/core/services/one-signal.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { ViewEmployeeMonitor } from "./monitor/view-employee-monitor/view-employee-monitor";
import { ViewEmployeeMobile } from "./movil/view-employee-mobile/view-employee-mobile";
/**
 * Layout Completo: El Centro de Operaciones 🚀
 *
 * ¡Bienvenido al verdadero corazón de la aplicación para empleados! Este no es un layout cualquiera,
 * es el "con todo incluido", el "agasajo", donde toda la magia sucede.
 *
 * A diferencia del layout minimalista, este se encarga de despertar a los pesos pesados:
 *   - `SignalRService`: Para chismorrear en tiempo real con el servidor. 🗣️
 *   - `OneSignalService`: El cartero de las notificaciones push. 📬
 *   - `MenuService`: El arquitecto que construye el menú dinámico según tus permisos. 🏗️
 *
 * Al proveer estos servicios aquí (y no en `root`), nos aseguramos de que solo se creen y consuman
 * recursos cuando un usuario que los necesita (un empleado normal) está en sesión. Eficiencia pura. ✨
 *
 * 📱 Detección de dispositivos:
 *   Usa `BreakpointObserver` de Angular CDK + `toSignal()` para reactividad
 *   compatible con Zoneless change detection. Adiós `@HostListener` y `window.innerWidth`. 🧘
 */

@Component({
  selector: "app-layout-employee",
  templateUrl: "./layout-employee.html",
  imports: [ViewEmployeeMonitor, ViewEmployeeMobile],
  // La magia de la carga perezosa de servicios ocurre aquí.
  // Estos servicios solo "viven" mientras este layout esté activo.
  providers: [SignalRService, OneSignalService],
})
export class LayoutEmployee implements OnInit {
  private logger = inject(ConsoleLoggerService);
  private authService = inject(AuthService);
  private signalRService = inject(SignalRService);
  private oneSignalService = inject(OneSignalService);
  private breakpointObserver = inject(BreakpointObserver);

  /**
   * 📱 Signal reactivo que indica si estamos en vista mobile.
   * Usa BreakpointObserver del CDK en vez de window.innerWidth,
   * lo que lo hace compatible con Zoneless y SSR. ✨
   */
  isMobileView = toSignal(
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    this.logger.custom(
      "🎉",
      "#2196F3",
      "[LayoutEmployee] ¡Layout de empleado cargado! Despertando a los gigantes (SignalR, OneSignal...)",
    );

    // Ahora que sabemos que estamos en el layout correcto, iniciamos los servicios de sesión.
    this.signalRService.start();
    this.initializeOneSignal();
  }

  /**
   * 🔔 Inicia OneSignal solo si tenemos un usuario autenticado.
   * Es una doble verificación, porque este layout no debería cargarse sin un usuario,
   * pero un poco de paranoia en la programación nunca viene mal. 😉
   */
  private initializeOneSignal(): void {
    const userId = this.authService.applicationUserId;
    if (userId) {
      this.logger.info(
        `[LayoutEmployee] Usuario ${userId} autenticado. Iniciando OneSignal...`,
      );
      this.oneSignalService.initializeAndLoginUser(userId);
    } else {
      this.logger.warn(
        "[LayoutEmployee] Se intentó iniciar OneSignal sin un ID de usuario. Algo es raro.",
      );
    }
  }
}
