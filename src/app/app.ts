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
import { Component, inject, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MessageService } from "primeng/api";
import { filter } from "rxjs/operators";
// 🧩 Componentes globales que acompañan siempre a la app
import { PrimeNgCustomToast } from "@ui/web/primeng-custom-toast/primeng-custom-toast";
import { TapToTop } from "@ui/mobile/tap-to-top/tap-to-top";
// 🛠️ Servicios esenciales (nivel App, no de sesión)
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { FeatureAnnouncementService } from "src/app/core/services/feature-announcement.service";
import { MessagingService } from "src/app/core/services/notification-messaging.service";
import { UpdateService } from "src/app/core/services/update-pwa.service";
import { ConsoleLoggerService } from "./core/services/console-logger.service";
import { TitleService } from "./core/services/title.service";
@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    TapToTop,
    PrimeNgCustomToast,
    ConfirmDialogModule,
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
  private messageService = inject(MessageService);
  private logger = inject(ConsoleLoggerService);
  private featureAnnouncementService = inject(FeatureAnnouncementService);
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

    // Verificar novedades de versión
    this.featureAnnouncementService.checkForUpdates();

    // El ConnectivityService se auto-inicializa mágicamente. ✨
  }

  /**
   * 🔔 Verifica el estado de notificaciones y muestra un prompt amigable si es necesario
   */
  private checkNotificationStatus(): void {
    const permission = this.messagingService.getPermissionStatus();

    // Solo mostrar si el usuario no ha decidido aún
    if (permission === "default") {
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
      detail: "¿Recibir notificaciones importantes? activarlas ahora.",
      sticky: true,
      data: {
        onAction: async () => {
          this.logger.custom(
            "🔔",
            "#4CAF50",
            "[App] Usuario aceptó activar notificaciones",
          );
          const result = await this.messagingService.requestPermission();
          this.messageService.clear("notification-prompt");
          if (result === "granted") {
            this.messageService.add({
              severity: "success",
              summary: "✅ ¡Listo!",
              detail: "Notificaciones activadas correctamente",
              life: 3000,
            });
          }
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
  // --- 🔄 Gestión de actualizaciones de la PWA ---
  /**
   * Escucha el observable del `UpdateService` que anuncia
   * cuando hay una nueva versión lista para instalar.
   * Cuando eso ocurre, se lanza un toast bonito para invitar al usuario a actualizar. 💌
   */
  private initializeUpdateListener(): void {
    this.updateService.updateAvailable$
      .pipe(filter((available: boolean) => available))
      .subscribe(() => {
        this.logger.custom(
          "🆕",
          "#FF9800",
          '[App] ¡Nueva versión detectada! Mostrando el botón de "Actualizar ahora".',
        );
        this.showUpdateToast();
      });
  }

  /**
   * 🎨 Muestra un toast con acción personalizada (tipo snackbar),
   * para avisar que hay una nueva versión disponible del PWA.
   * Al presionar “Actualizar”, el servicio `UpdateService` aplicará la nueva versión y refrescará la app.
   */
  private showUpdateToast(): void {
    this.logger.custom("🔔", "#FF9800", "Mostrando toast de actualización...");
    this.messageService.add({
      key: "update-toast",
      severity: "info",
      summary: "Actualización Disponible",
      detail: "Hay una nueva versión de la aplicación. ¡Actualiza ahora! 🚀",
      sticky: true, // permanece hasta que el usuario actúe
      data: {
        onAction: () => {
          this.logger.success(
            '[App] Usuario hizo clic en "Actualizar". Aplicando nueva versión...',
          );
          this.messageService.clear("update-toast");
          this.updateService.activateUpdate();
        },
        actionLabel: "Actualizar",
      },
    });
  }
}
