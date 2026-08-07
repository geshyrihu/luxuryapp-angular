import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { BadgeModule } from "primeng/badge";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-notifications-list-web",
  templateUrl: "./notifications-list-web.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeModule, ScrollPanelModule, AppIcon, WebButtonIcon],
})
export class NotificationsListWeb implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  private signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private consoleLogger = inject(ConsoleLoggerService);

  notifications = signal<any[]>([]);
  loading = signal(false);

  constructor() {
    this.signalRService.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.consoleLogger.info(
          "NotificationsListWeb: Evento recibido, recargando la lista.",
        );
        this.onLoadNotification();
      });
  }

  ngOnInit(): void {
    this.onLoadNotification();
  }

  onLoadNotification(): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetListNotLoading(Endpoints.Notifications.getAll)
      .then((result: any) => {
        if (result) {
          this.notifications.set(result);
        }
        this.loading.set(false);
      });
  }

  markAsRead(notificationId: string, url: string): void {
    const urlApi = Endpoints.Notifications.markAsRead(notificationId);
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigateByUrl(url);
    });
  }
}
