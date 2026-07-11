import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import {
  arrowForwardOutline,
  notifications,
  notificationsOffOutline,
  notificationsOutline,
} from "ionicons/icons";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-notifications-list-mobile",
  templateUrl: "./notifications-list-mobile.html",
  styles: [
    `
      ion-content {
        --background: var(--ion-background-color);
      }

      .unread ion-label h2 {
        font-weight: bold;
      }

      .timestamp {
        font-size: 0.75rem;
        color: var(--ion-color-medium);
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 2rem;
      }

      .empty-icon {
        font-size: 5rem;
        color: var(--ion-color-medium);
        opacity: 0.5;
      }

      .empty-text {
        margin-top: 1rem;
        color: var(--ion-color-medium);
        font-size: 1.1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,IonicModule],
})
export class NotificationsListMobile implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  router = inject(Router);
  signalRService = inject(SignalRService);
  private consoleLogger = inject(ConsoleLoggerService);
  notifications = signal<any[]>([]);

  constructor() {
    addIcons({
      arrowForwardOutline,
      notificationsOutline,
      notifications,
      notificationsOffOutline,
    });
  }

  ngOnInit() {
    this.onLoadNotification();

    // Escuchar los eventos del SignalRService
    this.signalRService.messageReceived$.subscribe(() => {
      this.consoleLogger.info(
        "Se recibió una señal, recargando notificaciones.",
      );
      this.onLoadNotification();
    });
  }

  onLoadNotification(event?: any) {
    const urlApi = `notifications`;
    this.apiResponseS.onGetListNotLoading(urlApi).then((result: any) => {
      this.notifications.set(result);
      if (event) {
        event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.onLoadNotification(event);
  }

  /**
   * Marca una notificación como leída
   * @param notificationId ID de la notificación a marcar
   */
  markAsRead(notificationId: string, url: string): void {
    const urlApi = `Notifications/mark-as-read/${notificationId}`;

    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigateByUrl(url);
    });
  }
}
