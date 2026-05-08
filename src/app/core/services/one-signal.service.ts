import { inject, Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { environment } from "src/environments/environment";
import { ConsoleLoggerService } from "./console-logger.service";
declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}

@Injectable({
  providedIn: "root",
})
export class OneSignalService {
  authS = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private consoleLogger = inject(ConsoleLoggerService);

  private appId = environment.ONESIGNAL_APPID;
  private isInitialized = false;

  public async initializeAndLoginUser(externalUserId: string): Promise<void> {
    if (this.isInitialized) {
      this.consoleLogger.custom(
        "ℹ️",
        "gray",
        "[OneSignal] Ya está inicializado (flag interno).",
      );
      return;
    }

    if (
      window.OneSignal &&
      typeof window.OneSignal.isPushNotificationsInitialized === "function" &&
      window.OneSignal.isPushNotificationsInitialized()
    ) {
      this.consoleLogger.custom(
        "ℹ️",
        "gray",
        "[OneSignal] SDK ya está inicializado (SDK check).",
      );
      this.isInitialized = true;
      return;
    }

    if (!externalUserId) {
      this.consoleLogger.custom(
        "❌",
        "red",
        "[OneSignal] Se requiere un externalUserId para inicializar.",
      );
      return;
    }

    try {
      this.consoleLogger.custom(
        "⏳",
        "orange",
        "[OneSignal] Esperando que el SDK esté listo...",
      );
      await this.waitForOneSignalSDK();
      this.consoleLogger.custom("✅", "green", "[OneSignal] SDK listo");

      await window.OneSignal.init({
        appId: this.appId,
        allowLocalhostAsSecureOrigin: !environment.production,
      });
      this.consoleLogger.custom(
        "📦",
        "teal",
        "[OneSignal] Inicializado con App ID:",
        this.appId,
      );

      this.registerEventListeners();

      await window.OneSignal.login(externalUserId);
      this.consoleLogger.custom(
        "👤",
        "darkslateblue",
        `[OneSignal] Usuario logueado con ExternalUserId: ${externalUserId}`,
      );

      this.isInitialized = true;
      await this.ensureOneSignalSubscription();
    } catch (error) {
      this.consoleLogger.custom(
        "🔥",
        "red",
        "[OneSignal] Error fatal durante la inicialización o login:",
        error,
      );
    }
  }

  private waitForOneSignalSDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.OneSignal && typeof window.OneSignal.init === "function") {
        return resolve();
      }
      window.OneSignal = window.OneSignal || [];
      window.OneSignal.push(() => {
        resolve();
      });
    });
  }

  async ensureOneSignalSubscription() {
    const isGranted = Notification.permission === "granted";
    const isOptedIn = await window.OneSignal.User.PushSubscription.optedIn;

    this.consoleLogger.custom(
      "📣",
      "dodgerblue",
      "[OneSignal] Permiso:",
      isGranted,
      "| Suscrito:",
      isOptedIn,
    );

    if (!isGranted || !isOptedIn) {
      this.consoleLogger.custom(
        "⚠️",
        "orange",
        "[OneSignal] Usuario no completamente suscrito.",
      );
    }
  }

  private registerEventListeners(): void {
    window.OneSignal.Notifications.addEventListener("click", (event: any) => {
      this.consoleLogger.custom(
        "🔔",
        "orange",
        "[OneSignal] Notificación clickeada:",
        event,
      );
      const customData = event.notification?.data;
      if (customData && customData.route) {
        this.zone.run(() => {
          this.router.navigateByUrl(customData.route);
        });
      }
    });
    this.consoleLogger.custom(
      "🎧",
      "cyan",
      "[OneSignal] Listener de 'click' en notificaciones registrado.",
    );
  }

  public async logout(): Promise<void> {
    if (!this.isInitialized) return;
    await window.OneSignal.logout();
    this.isInitialized = false;
    this.consoleLogger.custom("👋", "red", "[OneSignal] Usuario deslogueado");
  }
}









