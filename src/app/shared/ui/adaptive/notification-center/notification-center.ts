import { Component, inject } from "@angular/core";
import { NotificationCenterBase } from "@ui/base/notification-center.base";
import { MobileNotificationCenter } from "@ui/mobile/notification-center/notification-center";
import { NotificationCenter } from "@ui/web/notification-center/notification-center";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de NotificationCenter. Renderiza
 * `app-notification-center` (popover PrimeNG) o `ili-notification-center`
 * (bottom-sheet) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-notification-center [notifications]="..." />`.
 */
@Component({
  selector: "lx-notification-center",

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
