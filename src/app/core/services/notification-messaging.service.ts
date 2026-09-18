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
      let permission: NotificationPermission;
      if (
        this.allowedOrigins.includes(window.location.origin) &&
        window.OneSignal?.Notifications?.requestPermission
      ) {
        await window.OneSignal.Notifications.requestPermission();
        permission = Notification.permission;
      } else {
        permission = await Notification.requestPermission();
      }

      // Verificar el estado real del permiso después de la solicitud
      // (algunos navegadores no actualizan Notification.permission inmediatamente)
      const actualPermission = this.getPermissionStatus();
      console.log(
        `%c[MessagingService] Resultado permiso solicitado: ${permission}, verificado: ${actualPermission}`,
        "color: dodgerblue; font-weight: bold;",
      );
      return actualPermission;
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
