import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class MessagingService {
  /**
   * Verifica el estado actual del permiso (sin solicitarlo)
   */
  getPermissionStatus(): NotificationPermission {
    if (!("Notification" in window)) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Verifica si ya tenemos permiso concedido
   */
  hasPermission(): boolean {
    return this.getPermissionStatus() === "granted";
  }

  /**
   * 🔔 Solicita permiso de notificaciones (SOLO cuando el usuario lo pida explícitamente)
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("Este navegador no soporta notificaciones");
      return "denied";
    }

    if (this.hasPermission()) {
      console.log(
        "%c✅ [MessagingService] Ya tenemos permiso",
        "color: green; font-weight: bold;",
      );
      return "granted";
    }

    try {
      const permission = await Notification.requestPermission();
      console.log(
        `%c🔔 [MessagingService] Resultado permiso: ${permission}`,
        "color: dodgerblue; font-weight: bold;",
      );
      return permission;
    } catch (error) {
      console.error("Error al solicitar permiso:", error);
      return "denied";
    }
  }

  /**
   * 📬 Muestra una notificación (solo si tenemos permiso)
   */
  showNotification(title: string, options?: NotificationOptions): void {
    if (this.hasPermission()) {
      new Notification(title, options);
    } else {
      console.warn("No hay permiso para mostrar notificaciones");
    }
  }
}









