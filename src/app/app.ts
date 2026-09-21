/**
 * 🌟 App: El Anfitrión Minimalista 💅
 *
 * ¡Hola! Soy el componente raíz de la aplicación Angular.
 * Antes me encargaba de TODO (SignalR, OneSignal, sesiones, autenticación...),
 * y honestamente, era un infierno de responsabilidades. 😵
 *
 * Pero eso ya quedó atrás. Gracias a una cirugía arquitectónica de primer nivel 🧠,
 * ahora me dedico a lo que mejor sé hacer: ser el anfitrión elegante de toda la app.
 *
 * 💼 Mi trabajo actual:
 *   - Servir como punto de entrada de la aplicación (sí, el mismísimo `app-root`).
 *   - Renderizar el `router-outlet`, el corazón donde se proyectan los layouts y vistas.
 *   - Mantener con vida algunos servicios **verdaderamente globales**, que deben existir
 *     incluso antes de saber si el usuario está logueado o no:
 *       • `UpdateService`: controla actualizaciones del PWA, avisándote si hay versión nueva. ✨
 *       • `ConnectivityService`: monitorea si hay internet o si te fuiste al desierto sin Wi-Fi. 🏜️
 *       • `MessagingService`: gestiona el permiso de notificaciones push (con educación, claro).
 *       • `ConsoleLoggerService`: imprime logs visuales y divertidos, porque los devs también merecemos estilo.
 *       • `NavigationGestureService`: doma los gestos de navegación del usuario como si fuera un sensei del UX. 🥋
 *
 * 🚫 ¿Qué NO hago más?
 *   - No manejo sesiones de usuario.
 *   - No escucho notificaciones personalizadas (eso vive en layouts privados).
 *   - No administro estados de autenticación ni rutas seguras.
 *
 * En resumen: soy ligero, reactivo y zen. 🧘‍♂️
 * Mi lema: *"Menos responsabilidades, más elegancia."*
 */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AuthService } from "@core/auth/services/auth.service";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { MessageService } from "@core/services/message.service";
import { fromEvent, merge } from "rxjs";
import { filter } from "rxjs/operators";
// 🧩 Componentes globales que acompañan siempre a la app
import { AppToast } from "@ui/web/toast/toast";
import { LxScrollTop } from "@ui/adaptive/tap-to-top/tap-to-top";
// 🛠️ Servicios esenciales (nivel App, no de sesión)
import { FeatureAnnouncementService } from "@core/services/feature-announcement.service";
import { MessagingService } from "@core/services/notification-messaging.service";
import { UpdateService } from "@core/services/update-pwa.service";
import { ConsoleLoggerService } from "./core/services/console-logger.service";
import { TitleService } from "./core/services/title.service";
@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    LxScrollTop,
    AppToast,
    // WhatsNew,
    // AiChatWidget,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./app.html",
})
export class App implements OnInit {
  // --- 💉 Inyección de dependencias minimalista (solo lo esencial) ---
  private messagingService = inject(MessagingService);
  private updateService = inject(UpdateService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private logger = inject(ConsoleLoggerService);
  private featureAnnouncementService = inject(FeatureAnnouncementService);
  private destroyRef = inject(DestroyRef);
  private updateIdleTimer?: ReturnType<typeof setTimeout>;
  private readonly updateIdleDelayMs = 60_000;
  // Inyectamos TitleService para que se instancie y el effect del título funcione
  private titleService = inject(TitleService);
  // --- 🚀 Ciclo de vida inicial ---
  ngOnInit(): void {
    // El código para prevenir el gesto de "swipe back" se ha movido
    // completamente al NavigationGestureService para centralizar la lógica y evitar conflictos.
    // El servicio se inyecta y se inicializa automáticamente.

    this.logger.custom(
      "🚀",
      "#673AB7",
      "[App] ¡Aplicación iniciada! Soy más ligero y rápido que nunca.",
    );

    // 🪄 Inicializa servicios verdaderamente globales (sin importar el usuario)
    this.checkNotificationStatus();
    this.initializeUpdateListener(); // Escucha nuevas versiones del PWA
    this.initializeSafeUpdateTriggers();

    // Verificar novedades de versión
    this.featureAnnouncementService.checkForUpdates();

    // El ConnectivityService se auto-inicializa mágicamente. ✨
  }

  /**
   * 🔔 Verifica el estado de notificaciones y muestra un prompt amigable si es necesario
   */
  private checkNotificationStatus(): void {
    const permission = this.messagingService.getPermissionStatus();
    const dismissed =
      localStorage.getItem("notificationPromptDismissed") === "true";

    // Solo mostrar si el usuario no ha decidido aún y no ha dismissado el prompt
    if (permission === "default" && !dismissed) {
      // Esperar 5 segundos antes de mostrar el toast (menos intrusivo)
      setTimeout(() => {
        this.showNotificationPrompt();
      }, 5000);
    } else if (permission === "granted") {
      this.logger.success("[App] Notificaciones ya autorizadas ✅");
    } else {
      this.logger.warn("[App] Notificaciones bloqueadas por el usuario");
    }
  }

  /**
   * 🎨 Muestra un toast invitando al usuario a activar notificaciones
   */
  private showNotificationPrompt(): void {
    this.messageService.add({
      key: "notification-prompt",
      severity: "info",
      summary: "🔔 Notificaciones",
      detail: "¿Recibir notificaciones importantes? Actívalas ahora.",
      sticky: true,
      data: {
        onAction: () => {
          this.logger.custom(
            "🔔",
            "#4CAF50",
            "[App] Usuario aceptó activar notificaciones",
          );
          this.messagingService
            .requestPermission()
            .then((result) => {
              this.messageService.clear("notification-prompt");
              // Guardar que el usuario ya interactuó con el prompt (no volver a mostrar)
              localStorage.setItem("notificationPromptDismissed", "true");
              if (result === "granted") {
                this.messageService.add({
                  severity: "success",
                  summary: "✅ ¡Listo!",
                  detail: "Notificaciones activadas correctamente",
                  life: 3000,
                });
              } else if (result === "denied") {
                this.messageService.add({
                  severity: "warn",
                  summary: "⚠️ Permiso denegado",
                  detail:
                    "Las notificaciones fueron bloqueadas. Puedes habilitarlas en la configuración del navegador.",
                  life: 5000,
                });
              } else {
                this.messageService.add({
                  severity: "info",
                  summary: "ℹ️ Sin cambios",
                  detail: "No se modificó el estado de notificaciones.",
                  life: 3000,
                });
              }
            })
            .catch((error) => {
              this.logger.error(
                "[App] Error solicitando permiso notificaciones",
                error,
              );
              this.messageService.clear("notification-prompt");
              localStorage.setItem("notificationPromptDismissed", "true");
              this.messageService.add({
                severity: "error",
                summary: "❌ Error",
                detail: "No se pudo activar notificaciones",
                life: 3000,
              });
            });
        },
        actionLabel: "Activar",
        onCancel: () => {
          this.logger.warn("[App] Usuario rechazó notificaciones");
          this.messageService.clear("notification-prompt");
          // Guardar que el usuario no quiere ser molestado de nuevo
          localStorage.setItem("notificationPromptDismissed", "true");
        },
        cancelLabel: "Ahora no",
      },
    });
  }
  // --- 🔄 Actualizaciones silenciosas de la PWA ---
  /**
   * Escucha el observable del `UpdateService` que anuncia
   * cuando hay una nueva versión lista para instalar.
   *
   * No mostramos un toast: los despliegues pueden ocurrir diariamente y una
   * alerta repetitiva interrumpe el trabajo. La versión queda pendiente y se
   * activa mediante uno de los disparadores seguros definidos abajo.
   */
  private initializeUpdateListener(): void {
    this.updateService.updateAvailable$
      .pipe(filter((available: boolean) => available))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.logger.custom(
          "🆕",
          "#FF9800",
          "[App] Nueva versión lista. Se aplicará en un punto seguro.",
        );
        this.scheduleUpdateAfterInactivity();
      });
  }

  private initializeSafeUpdateTriggers(): void {
    // Tras iniciar sesión, el usuario ya cruzó el límite de autenticación y
    // podemos aplicar una versión pendiente antes de comenzar su jornada.
    this.authService.isAuthenticated$
      .pipe(
        filter((authenticated) => authenticated),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.activateUpdateIfAvailable("inicio de sesión"));

    // NavigationEnd ocurre después de completar navegación. Es un momento
    // natural para actualizar sin cortar una operación en curso.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.activateUpdateIfAvailable("cambio de módulo"));

    // Si el usuario sigue trabajando, no recargamos la aplicación. Cada
    // interacción reinicia la espera y la actualización ocurre 60 s después
    // de la última actividad.
    merge(
      fromEvent(document, "pointerdown"),
      fromEvent(document, "keydown"),
      fromEvent(document, "touchstart"),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.scheduleUpdateAfterInactivity());

    this.destroyRef.onDestroy(() => {
      if (this.updateIdleTimer) clearTimeout(this.updateIdleTimer);
    });
  }

  private activateUpdateIfAvailable(reason: string): void {
    if (!this.updateService.isUpdateAvailable()) return;

    this.logger.custom("🔄", "#FF9800", `[App] Actualizando por ${reason}...`);
    void this.updateService.activateUpdate();
  }

  private scheduleUpdateAfterInactivity(): void {
    if (!this.updateService.isUpdateAvailable()) return;

    if (this.updateIdleTimer) clearTimeout(this.updateIdleTimer);
    this.updateIdleTimer = setTimeout(() => {
      this.updateIdleTimer = undefined;
      this.activateUpdateIfAvailable("inactividad");
    }, this.updateIdleDelayMs);
  }
}
