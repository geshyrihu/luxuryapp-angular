import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
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
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SignalRService } from "src/app/core/services/signalr.service";

interface FooterItem {
  label: string;
  icon: string;
  link?: string | any[];
  action?: () => void;
  showNotification?: boolean;
}

@Component({
  selector: "app-footer-employee-mobile",
  imports: [RouterModule, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./footer-employee-mobile.html",
})
export class FooterEmployeeMobile implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  signalRService = inject(SignalRService);
  router = inject(Router);
  aspRoleS = inject(AspRoleService);
  menuCtrl = inject(MenuController);
  
  messageInNotRead = signal<number>(0);
  footerItems = signal<FooterItem[]>([]);

  showText = false;

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
    // Fetch once on init to get initial count
    this.onLoadNotification();
    
    this.signalRService.messageReceived$.subscribe(() => {
      this.onLoadNotification();
    });
  }

  setFooterItems() {
    if (this.aspRoleS.hasRole(EApplicationRole.Proveedor)) {
      this.footerItems.set([
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
      ]);
    } else if (this.aspRoleS.hasRole(EApplicationRole.SuperUsuario)) {
      this.footerItems.set([
        {
          label: "Inicio",
          icon: "home-outline",
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
          link: ["/admin"],
        },
      ]);
    } else {
      this.footerItems.set([
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
      ]);
    }
  }

  onLoadNotification() {
    const urlApi = `Notifications/unread-count`;
    this.apiResponseS.onGetListNotLoading(urlApi).then((result: any) => {
      this.messageInNotRead.set(result);
    });
  }

  isActive(link?: string | any[]): boolean {
    if (!link) return false;
    return this.router.url === (Array.isArray(link) ? link[0] : link);
  }
}
