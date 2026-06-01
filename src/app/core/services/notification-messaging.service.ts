import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessagingService {
  private allowedOrigins = environment.ONESIGNAL_ALLOWED_ORIGINS ?? [];

  getPermissionStatus(): NotificationPermission {
    if (!("Notification" in window)) {
      return "denied";
    }
    return Notification.permission;
  }

  hasPermission(): boolean {
    return this.getPermissionStatus() === "granted";
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Este navegador no soporta notificaciones");
      return "denied";
    }

    if (this.hasPermission()) {
      console.log(
        "%c[MessagingService] Ya tenemos permiso",
        "color: green; font-weight: bold;",
      );
      return "granted";
    }

    try {
      if (
        this.allowedOrigins.includes(window.location.origin) &&
        window.OneSignal?.Notifications?.requestPermission
      ) {
        await window.OneSignal.Notifications.requestPermission();
      } else {
        await Notification.requestPermission();
      }

      const permission = Notification.permission;
      console.log(
        `%c[MessagingService] Resultado permiso: ${permission}`,
        "color: dodgerblue; font-weight: bold;",
      );
      return permission;
    } catch (error) {
      console.error("Error al solicitar permiso:", error);
      return "denied";
    }
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (this.hasPermission()) {
      new Notification(title, options);
    } else {
      console.warn("No hay permiso para mostrar notificaciones");
    }
  }
}
