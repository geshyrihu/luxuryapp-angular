import { Directive, input, output } from "@angular/core";

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  severity?: "info" | "warn" | "danger" | "success" | "contrast";
}

/**
 * Base compartida de NotificationCenter.
 *  - web:     `app-notification-center` (campana + p-popover)
 *  - mobile:  `ili-notification-center` (campana + bottom-sheet)
 *  - wrapper: `lx-notification-center`  (auto runtime)
 */
@Directive()
export abstract class NotificationCenterBase {
  notifications = input<NotificationItem[]>([]);
  unreadCount = input<number>(0);

  notificationClick = output<NotificationItem>();
  markAllRead = output<void>();

  onItemClick(item: NotificationItem): void {
    this.notificationClick.emit(item);
  }
}
