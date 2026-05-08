import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, RouterModule } from "@angular/router";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { Popover, PopoverModule } from "primeng/popover";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { TooltipModule } from "primeng/tooltip";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { SignalRService } from "src/app/core/services/signalr.service";
@Component({
  selector: "app-notifications-gadget",
  imports: [
    RouterModule,
    BadgeModule,
    PopoverModule,
    ButtonModule,
    TooltipModule,
    ScrollPanelModule,
  ],
  templateUrl: "./notifications-gadget.html",
})
export class NotificationsGadget implements OnInit {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  apiResponseS = inject(ApiResponseService);
  private router = inject(Router);
  public signalRService = inject(SignalRService);
  private destroyRef = inject(DestroyRef);
  private consoleLogger = inject(ConsoleLoggerService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---
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

  markAsRead(notificationId: string, url: string, popover: Popover): void {
    popover.hide(); // Ocultamos el popover directamente
    const urlApi = `Notifications/mark-as-read/${notificationId}`;
    this.apiResponseS.onGetItem(urlApi).then(() => {
      this.onLoadNotification();
      this.router.navigate([url]);
    });
  }
}
