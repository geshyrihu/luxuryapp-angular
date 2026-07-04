import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { NotificationCenter } from "src/app/core/components/web/notification-center/notification-center";
import { MobileNotificationCenter } from "src/app/core/components/mobile/notification-center/notification-center";
import { NotificationCenterBase } from "./notification-center-base";

/**
 * Wrapper multiplataforma de NotificationCenter. Renderiza
 * `app-notification-center` (popover PrimeNG) o `ili-notification-center`
 * (bottom-sheet) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-notification-center [notifications]="..." />`.
 */
@Component({
  selector: "lx-notification-center",
  standalone: true,
  imports: [NotificationCenter, MobileNotificationCenter],
  template: `
    @if (platform.isMobile()) {
      <ili-notification-center
        [notifications]="notifications()"
        [unreadCount]="unreadCount()"
        (notificationClick)="notificationClick.emit($event)"
        (markAllRead)="markAllRead.emit()"
      />
    } @else {
      <app-notification-center
        [notifications]="notifications()"
        [unreadCount]="unreadCount()"
        (notificationClick)="notificationClick.emit($event)"
        (markAllRead)="markAllRead.emit()"
      />
    }
  `,
})
export class LxNotificationCenter extends NotificationCenterBase {
  protected platform = inject(PlatformService);
}
