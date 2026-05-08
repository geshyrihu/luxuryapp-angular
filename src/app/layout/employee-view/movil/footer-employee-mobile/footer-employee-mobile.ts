import { Component, inject, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import {
  IonBadge,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  MenuController,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  calendarOutline,
  homeOutline,
  megaphoneOutline,
  notificationsOutline,
  settingsOutline,
  ticketOutline,
} from "ionicons/icons";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { SignalRService } from "src/app/core/services/signalr.service";
interface FooterItem {
  label: string;
  icon: string;

  link?: string | any[];
  action?: () => void; // Optional action
  showNotification?: boolean;
}

@Component({
  selector: "app-footer-employee-mobile",
  imports: [RouterModule, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  templateUrl: "./footer-employee-mobile.html",
})
export class FooterEmployeeMobile implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  signalRService = inject(SignalRService);
  router = inject(Router);
  aspRoleS = inject(AspRoleService);
  menuCtrl = inject(MenuController);
  messageInNotRead: number = 0;
  footerItems: FooterItem[] = [];

  showText = false; // Cambia a true si quieres mostrar texto

  constructor() {
    addIcons({
      ticketOutline,
      notificationsOutline,
      homeOutline,
      calendarOutline,
      megaphoneOutline,
      settingsOutline,
    });
  }

  ngOnInit() {
    this.setFooterItems();
    this.signalRService.messageReceived$.subscribe(() => {
      this.onLoadNotification();
    });
  }

  setFooterItems() {
    // Ejemplo: puedes ajustar los ítems y roles según tu lógica
    if (this.aspRoleS.hasRole(EApplicationRole.Proveedor)) {
      this.footerItems = [
        {
          label: "Resumen",
          icon: "ticket-outline",
          link: ["/tickets/my-assignments"],
        },
        {
          label: "Notificaciones",
          icon: "notifications-outline",
          link: ["/notifications"],
          showNotification: true,
        },
      ];
    } else if (this.aspRoleS.hasRole(EApplicationRole.SuperUsuario)) {
      this.footerItems = [
        {
          label: "Inicio",
          icon: "home-outline",
          // Open the specific menu ID defined in ViewEmployeeMobile
          action: () => this.menuCtrl.open("employee-mobile-menu"),
        },
        {
          label: "Resumen",
          icon: "calendar-outline",
          link: ["/dashboard"],
        },
        {
          label: "Anuncios",
          icon: "megaphone-outline",
          link: ["/announcements/list"],
        },
        {
          label: "Notificaciones",
          icon: "notifications-outline",
          link: ["/notifications"],
          showNotification: true,
        },
        {
          label: "Config",
          icon: "settings-outline",
          link: ["/settings/home"],
        },
      ];
    } else {
      // Otros roles...
      this.footerItems = [
        {
          label: "Inicio",
          icon: "home-outline",
          action: () => this.menuCtrl.open("employee-mobile-menu"),
        },
        {
          label: "Anuncios",
          icon: "megaphone-outline",
          link: ["/announcements/list"],
        },
        {
          label: "Notificaciones",
          icon: "notifications-outline",
          link: ["/notifications"],
          showNotification: true,
        },
      ];
    }
  }

  onLoadNotification() {
    this.messageInNotRead = 0;
    const urlApi = `Notifications/unread-count`;
    this.apiResponseS.onGetListNotLoading(urlApi).then((result: any) => {
      this.messageInNotRead = result;
      this.setFooterItems(); // Actualiza íconos si cambia el estado
    });
  }

  isActive(link?: string | any[]): boolean {
    if (!link) return false;
    // Puedes mejorar esta lógica según tus rutas
    return this.router.url === (Array.isArray(link) ? link[0] : link);
  }
}









