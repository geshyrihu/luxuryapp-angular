import { Platform } from "@angular/cdk/platform";
import { inject, Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  alertCircle,
  checkmarkCircle,
  close,
  informationCircle,
  warning,
} from "ionicons/icons";
import { MessageService } from "primeng/api";
import { IToast } from "src/app/core/interfaces/toast.interface";
@Injectable({
  providedIn: "root",
})
export class CustomToastService {
  private messageService = inject(MessageService);
  private platform = inject(Platform);
  private toastController = inject(ToastController);

  constructor() {
    addIcons({
      checkmarkCircle,
      alertCircle,
      warning,
      informationCircle,
      close,
    });
  }

  // Detectar dinámicamente si es móvil/tablet en cada llamada
  // Esto permite probar cambiando el tamaño de ventana sin recargar
  private get isMobile(): boolean {
    return (
      this.platform.ANDROID || this.platform.IOS || window.innerWidth <= 768
    );
  }

  // Método genérico para mostrar notificaciones
  async show(toast: IToast) {
    if (this.isMobile) {
      await this.presentMobileToast(toast);
    } else {
      this.presentDesktopToast(toast);
    }
  }

  private presentDesktopToast(toast: IToast) {
    this.messageService.add({
      severity: toast.severity,
      summary: toast.summary,
      detail: toast.detail,
      life: toast.life || 3000,
    });
  }

  private async presentMobileToast(toast: IToast) {
    let color = "medium";
    let icon = "information-circle";

    switch (toast.severity) {
      case "success":
        color = "success";
        icon = "checkmark-circle";
        break;
      case "error":
        color = "danger";
        icon = "alert-circle";
        break;
      case "warn":
        color = "warning";
        icon = "warning";
        break;
      case "info":
        color = "primary";
        icon = "information-circle";
        break;
    }

    const ionToast = await this.toastController.create({
      message: toast.detail
        ? `${toast.summary}: ${toast.detail}`
        : toast.summary,
      duration: toast.life || 3000,
      color: color,
      position: "top",
      icon: icon,
      buttons: [
        {
          side: "end",
          icon: "mdi:close",
          role: "cancel",
        },
      ],
      cssClass: "custom-mobile-toast",
    });

    await ionToast.present();
  }

  // Métodos de ayuda para no tener que escribir el objeto completo cada vez
  showSuccess(summary: string, detail?: string) {
    this.show({ severity: "success", summary, detail });
  }

  showError(summary: string, detail?: string) {
    this.show({ severity: "error", summary, detail });
  }

  showInfo(summary: string, detail?: string) {
    this.show({ severity: "info", summary, detail });
  }

  showWarn(summary: string, detail?: string) {
    this.show({ severity: "warn", summary, detail });
  }
}









