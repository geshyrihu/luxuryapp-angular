import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation, signal } from "@angular/core";
import { ContextMenuBase } from "@ui/base/context-menu.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-context-menu",

  imports: [CommonModule, AppIcon],
  template: `
    <div
      class="ili-ctx-host"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
      (contextmenu)="onContextMenu($event)"
    >
      <ng-content />
    </div>
    @if (isOpen()) {
      <div class="ili-ctx-backdrop" (click)="close()"></div>
      <div
        class="ili-ctx-popover"
        [style.top.px]="posY()"
        [style.left.px]="posX()"
      >
        @for (item of items(); track $index) {
          @if (item.separator) {
            <hr class="ili-ctx-separator" />
          } @else {
            <button
              class="ili-ctx-item"
              [class.ili-ctx-item-disabled]="item.disabled"
              [disabled]="item.disabled"
              (click)="onItemClick(item)"
            >
              @if (item.icon) {
                <app-icon [icon]="item.icon" class="ili-ctx-item-icon" />
              }
              <span>{{ item.label }}</span>
            </button>
          }
        }
      </div>
    }
  `,
  styles: [
    `
      .ili-ctx-host {
        display: contents;
      }
      .ili-ctx-backdrop {
        position: fixed;
        inset: 0;
        z-index: 990;
        background: transparent;
      }
      .ili-ctx-popover {
        position: fixed;
        z-index: 991;
        min-width: 180px;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 8px);
        box-shadow: var(--ds-shadow-lg);
        padding: 0.375rem 0;
      }
      .ili-ctx-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.875rem;
        background: none;
        border: none;
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-primary);
        cursor: pointer;
        text-align: left;
      }
      .ili-ctx-item:active {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      .ili-ctx-item-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ili-ctx-item-icon {
        font-size: 1.125rem;
        color: var(--ds-text-secondary);
      }
      .ili-ctx-separator {
        margin: 0.25rem 0;
        border: none;
        border-top: 1px solid var(--ds-border, #e2e8f0);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileContextMenu extends ContextMenuBase {
  protected isOpen = signal(false);
  protected posX = signal(0);
  protected posY = signal(0);

  private touchStartPos: { x: number; y: number } | null = null;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;

  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.longPressTimer = setTimeout(() => {
      this.openAt(touch.clientX, touch.clientY);
      this.touchStartPos = null;
    }, 500);
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
    this.touchStartPos = null;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.openAt(event.clientX, event.clientY);
  }

  private openAt(x: number, y: number): void {
    this.posX.set(x);
    this.posY.set(y);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onItemClick(item: any): void {
    this.runCommand(item);
    this.close();
  }
}
