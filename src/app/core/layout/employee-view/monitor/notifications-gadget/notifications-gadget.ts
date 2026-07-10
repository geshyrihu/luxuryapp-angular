import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, RouterModule } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DrawerModule } from "primeng/drawer";
import { OverlayBadge } from "primeng/overlaybadge";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { TooltipModule } from "primeng/tooltip";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-notifications-gadget",
  imports: [
    RouterModule,
    AppIcon,
    OverlayBadge,
    DrawerModule,
    TooltipModule,
    ScrollPanelModule,
    WebButtonLabel,
  ],
  templateUrl: "./notifications-gadget.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./notifications-gadget.scss",
})
export class NotificationsGadget implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private consoleLogger = inject(ConsoleLoggerService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---
  public drawerVisible = signal(false);
  public messageInNotRead = signal(0);
  public notifications = signal<any[]>([]);

  constructor() {
    this.signalRService.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.consoleLogger.info(
          "NotificationsGadget: Evento recibido, recargando la lista.",
        );
        this.onLoadNotification();
      });
  }

  ngOnInit() {
    this.onLoadNotification();
  }

  onLoadNotification(): void {
    this.apiResponseS
      .onGetListNotLoading("notifications")
      .then((result: any) => {
        if (result) {
          this.notifications.set(result);
        }
      });
    this.apiResponseS
      .onGetListNotLoading("notifications/unread-count")
      .then((result: any) => {
        if (result) {
          this.messageInNotRead.set(result);
        }
      });
  }

  markAsRead(notificationId: string, url: string): void {
    this.drawerVisible.set(false);
    const urlApi = `Notifications/mark-as-read/${notificationId}`;
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigate([url]);
    });
  }

  irATodasLasNotificaciones(): void {
    this.drawerVisible.set(false);
    this.router.navigate(ROUTES.NOTIFICATIONS);
  }
}
