import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { NotificationCenterBase } from "@ui/base/notification-center.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { PopoverModule } from "primeng/popover";

export { type NotificationItem } from "@ui/base/notification-center.base";

@Component({
  selector: "app-notification-center",

  imports: [ButtonModule, PopoverModule, BadgeModule, AppIcon],
  template: `
    <div class="notification-center-root">
      <p-button
        type="button"
        [rounded]="true"
        [text]="true"
        severity="secondary"
        styleClass="p-relative"
        (onClick)="op.toggle($event)"
      >
        <div class="flex align-items-center gap-1">
          <app-icon icon="mdi:bell-outline" class="text-xl" />
          @if (unreadCount() > 0) {
            <p-badge [value]="unreadCount()" severity="danger" />
          }
        </div>
      </p-button>

      <p-popover
        #op
        appendTo="body"
        [style]="{ width: '380px', maxWidth: '90vw' }"
      >
        <div class="notification-panel">
          <div
            class="notification-header flex align-items-center justify-content-between px-1 pb-2"
          >
            <strong class="text-sm">Notificaciones</strong>
            @if (unreadCount() > 0) {
              <p-button
                label="Marcar todo leído"
                [link]="true"
                size="small"
                (onClick)="markAllRead.emit()"
              />
            }
          </div>

          <div class="notification-list">
            @for (item of notifications(); track item.id) {
              <div
                class="notification-item flex align-items-start gap-2 p-2 border-round cursor-pointer"
                [class.notification-unread]="!item.read"
                (click)="onItemClick(item)"
              >
                <app-icon
                  [icon]="item.icon"
                  class="text-lg mt-1"
                  [style.color]="
                    item.severity
                      ? 'var(--ds-' + item.severity + ')'
                      : 'var(--ds-text-muted)'
                  "
                />
                <div class="flex flex-column gap-1 flex-1 min-w-0">
                  <strong class="text-sm">{{ item.title }}</strong>
                  <p class="m-0 text-xs text-color-secondary line-height-2">
                    {{ item.description }}
                  </p>
                  <span class="text-xs text-color-muted">{{ item.time }}</span>
                </div>
                @if (!item.read) {
                  <span class="notification-dot mt-2"></span>
                }
              </div>
            } @empty {
              <div
                class="flex flex-column align-items-center gap-2 py-4 text-color-secondary"
              >
                <app-icon icon="mdi:bell-off-outline" class="text-3xl" />
                <span class="text-sm">Sin notificaciones</span>
              </div>
            }
          </div>
        </div>
      </p-popover>
    </div>
  `,
  styles: [
    `
      .notification-center-root {
        display: inline-flex;
      }
      .notification-panel {
        min-height: 100px;
      }
      .notification-header {
        border-bottom: 1px solid var(--ds-border);
      }
      .notification-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .notification-item {
        transition: background-color 0.15s;
      }
      .notification-item:hover {
        background-color: var(--ds-bg-sunken);
      }
      .notification-unread {
        background-color: var(--ds-primary-light);
      }
      .notification-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--ds-primary);
        flex-shrink: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class NotificationCenter extends NotificationCenterBase {}
