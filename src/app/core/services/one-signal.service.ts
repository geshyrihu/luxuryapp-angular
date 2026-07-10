import { inject, Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { environment } from "src/environments/environment";
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
  private allowedOrigins = environment.ONESIGNAL_ALLOWED_ORIGINS ?? [];
  private isInitialized = false;
  private listenersRegistered = false;

  public async initializeAndLoginUser(externalUserId: string): Promise<void> {
    if (!externalUserId) {
      this.consoleLogger.custom(
        "x",
        "red",
        "[OneSignal] Se requiere un externalUserId para inicializar.",
      );
      return;
    }

    if (!this.isCurrentOriginAllowed()) {
      this.consoleLogger.custom(
        "skip",
        "gray",
        `[OneSignal] Omitido en origen no permitido: ${window.location.origin}. Permitidos: ${this.allowedOrigins.join(", ") || "(ninguno configurado)"}`,
      );
      return;
    }

    try {
      const oneSignal = window.OneSignal as any;

      this.consoleLogger.custom(
        "...",
        "orange",
        "[OneSignal] Esperando que el SDK este listo...",
      );
      await this.waitForOneSignalSDK();
      this.consoleLogger.custom("ok", "green", "[OneSignal] SDK listo");

      if (!this.isInitialized) {
        await oneSignal.init({
          appId: this.appId,
          allowLocalhostAsSecureOrigin: !environment.production,
        });
        this.isInitialized = true;
        this.consoleLogger.custom(
          "pkg",
          "teal",
          "[OneSignal] Inicializado con App ID:",
          this.appId,
        );
      }

      this.registerEventListeners();

      await oneSignal.login(externalUserId);
      this.consoleLogger.custom(
        "user",
        "darkslateblue",
        `[OneSignal] Usuario logueado con ExternalUserId: ${externalUserId}`,
      );

      await this.ensureOneSignalSubscription();
    } catch (error) {
      this.consoleLogger.custom(
        "!",
        "red",
        "[OneSignal] Error fatal durante la inicializacion o login:",
        error,
      );
    }
  }

  private isCurrentOriginAllowed(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    return this.allowedOrigins.includes(window.location.origin);
  }

  private waitForOneSignalSDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.OneSignal && typeof window.OneSignal.init === "function") {
        resolve();
        return;
      }

      const deferred = ((window as any).OneSignal =
        (window as any).OneSignal || []);
      deferred.push(() => {
        resolve();
      });
    });
  }

  async ensureOneSignalSubscription(): Promise<void> {
    const isGranted = Notification.permission === "granted";
    const oneSignal = window.OneSignal as any;

    if (isGranted && !oneSignal.User.PushSubscription.optedIn) {
      this.consoleLogger.custom(
        "sync",
        "dodgerblue",
        "[OneSignal] Permiso concedido pero sin suscripcion. Intentando opt-in...",
      );
      await oneSignal.User.PushSubscription.optIn();
    }

    const isOptedIn = oneSignal.User.PushSubscription.optedIn;

    this.consoleLogger.custom(
      "sub",
      "dodgerblue",
      "[OneSignal] Permiso:",
      isGranted,
      "| Suscrito:",
      isOptedIn,
    );

    if (!isGranted || !isOptedIn) {
      this.consoleLogger.custom(
        "warn",
        "orange",
        "[OneSignal] Usuario no completamente suscrito.",
      );
    }
  }

  private registerEventListeners(): void {
    if (this.listenersRegistered) {
      return;
    }

    const oneSignal = window.OneSignal as any;

    oneSignal.Notifications.addEventListener("click", (event: any) => {
      this.consoleLogger.custom(
        "bell",
        "orange",
        "[OneSignal] Notificacion clickeada:",
        event,
      );
      const customData = event.notification?.data;
      if (customData?.route) {
        this.zone.run(() => {
          this.router.navigateByUrl(customData.route);
        });
      }
    });

    oneSignal.User.PushSubscription.addEventListener("change", (event: any) => {
      this.consoleLogger.custom(
        "mail",
        "mediumseagreen",
        "[OneSignal] Cambio de suscripcion:",
        event,
      );
    });

    this.listenersRegistered = true;
    this.consoleLogger.custom(
      "ear",
      "cyan",
      "[OneSignal] Listeners registrados.",
    );
  }

  public async logout(): Promise<void> {
    if (!this.isInitialized) return;
    await (window.OneSignal as any).logout();
    this.isInitialized = false;
    this.consoleLogger.custom("bye", "red", "[OneSignal] Usuario deslogueado");
  }
}
