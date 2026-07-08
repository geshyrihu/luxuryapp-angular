import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { NotificationCenterBase } from "@ui/base/notification-center.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-notification-center",

  imports: [CommonModule, AppIcon],
  template: `
    <button type="button" class="ili-nc-bell" (click)="open.set(true)">
      <app-icon icon="mdi:bell-outline" class="text-xl" />
      @if (unreadCount() > 0) {
        <span class="ili-nc-badge">{{ unreadCount() }}</span>
      }
    </button>

    @if (open()) {
      <div class="ili-nc-backdrop" (click)="open.set(false)">
        <div class="ili-nc-sheet" (click)="$event.stopPropagation()">
          <div class="ili-nc-header">
            <strong>Notificaciones</strong>
            @if (unreadCount() > 0) {
              <button
                type="button"
                class="ili-nc-markall"
                (click)="markAllRead.emit()"
              >
                Marcar todo leído
              </button>
            }
          </div>

          <div class="ili-nc-list">
            @for (item of notifications(); track item.id) {
              <div
                class="ili-nc-item"
                [class.ili-nc-unread]="!item.read"
                (click)="onItemClick(item); open.set(false)"
              >
                <app-icon
                  [icon]="item.icon"
                  class="text-lg"
                  [style.color]="
                    item.severity
                      ? 'var(--ds-' + item.severity + ')'
                      : 'var(--ds-text-muted)'
                  "
                />
                <div class="ili-nc-item-body">
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.description }}</p>
                  <span class="ili-nc-time">{{ item.time }}</span>
                </div>
                @if (!item.read) {
                  <span class="ili-nc-dot"></span>
                }
              </div>
            } @empty {
              <div class="ili-nc-empty">
                <app-icon icon="mdi:bell-off-outline" class="text-3xl" />
                <span>Sin notificaciones</span>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .ili-nc-bell {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        background: none;
        color: var(--ds-text-secondary);
        border-radius: 9999px;
      }
      .ili-nc-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 9999px;
        background: var(--ds-danger, #ba1a1a);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .ili-nc-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: flex-end;
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.4));
      }
      .ili-nc-sheet {
        width: 100%;
        max-height: 75vh;
        display: flex;
        flex-direction: column;
        background: var(--ds-bg-surface, #fff);
        border-radius: var(--ds-radius-modal, 12px) var(--ds-radius-modal, 12px)
          0 0;
        padding-bottom: env(safe-area-inset-bottom);
      }
      .ili-nc-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--ds-border);
      }
      .ili-nc-markall {
        border: none;
        background: none;
        color: var(--ds-primary, #003d9b);
        font-size: 0.8125rem;
        font-weight: 600;
      }
      .ili-nc-list {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      .ili-nc-item {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid var(--ds-border);
      }
      .ili-nc-unread {
        background: var(--ds-primary-light);
      }
      .ili-nc-item-body {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .ili-nc-item-body strong {
        font-size: 0.9rem;
        color: var(--ds-text-primary);
      }
      .ili-nc-item-body p {
        margin: 0;
        font-size: 0.8rem;
        color: var(--ds-text-secondary);
        line-height: 1.35;
      }
      .ili-nc-time {
        font-size: 0.72rem;
        color: var(--ds-text-muted);
      }
      .ili-nc-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ds-primary);
        flex-shrink: 0;
        margin-top: 0.35rem;
      }
      .ili-nc-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2.5rem 1rem;
        color: var(--ds-text-secondary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileNotificationCenter extends NotificationCenterBase {
  protected open = signal(false);
}
