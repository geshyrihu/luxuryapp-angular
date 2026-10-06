import { ButtonWeb } from "@ui/buttons/web";
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
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ConsoleLoggerService } from "@core/services/console-logger.service";
import { SignalRService } from "@core/services/signalr.service";
import { ROUTES } from "src/app/routing/route-paths";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { AppBadge } from "@ui/web/badge/badge";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-notifications-gadget",
  imports: [ButtonWeb, 
    RouterModule,
    LxIcon,
    AppBadge,
    LxTooltipDirective,
    NgbDropdownModule,
  ],
  templateUrl: "./notifications-gadget.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: "./notifications-gadget.scss",
})
export class NotificationsGadget implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private consoleLogger = inject(ConsoleLoggerService);
  private confirmS = inject(ConfirmService);
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
      .onGetListNotLoading(Endpoints.Notifications.getAll)
      .then((result: any) => {
        if (result) {
          this.notifications.set(result);
        }
      });
    this.apiResponseS
      .onGetListNotLoading(Endpoints.Notifications.unreadCount)
      .then((result: any) => {
        if (result) {
          this.messageInNotRead.set(result);
        }
      });
  }

  markAsRead(notificationId: string, url: string): void {
    this.drawerVisible.set(false);
    const urlApi = Endpoints.Notifications.markAsRead(notificationId);
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigate([url]);
    });
  }

  deleteNotification(notificationId: string): void {
    const urlApi = Endpoints.Notifications.delete(notificationId);
    this.apiResponseS.onDelete(urlApi).then((deleted) => {
      if (deleted) {
        this.onLoadNotification();
      }
    });
  }

  /**
   * Confirma y elimina una notificación. Contrato Fase 3: la confirmación
   * vive en el consumidor, no en el botón.
   */
  async onDeleteNotification(notificationId: string): Promise<void> {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta notificación?",
    );
    if (!confirmed) return;
    this.deleteNotification(notificationId);
  }

  irATodasLasNotificaciones(): void {
    this.drawerVisible.set(false);
    this.router.navigate(ROUTES.NOTIFICATIONS);
  }
}
