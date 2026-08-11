import { Component, ViewEncapsulation } from "@angular/core";
import { SwipeActionsBase } from "@ui/base/swipe-actions.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export type { SwipeAction } from "@ui/base/swipe-actions.base";

@Component({
  selector: "ili-swipe-actions",

  imports: [AppIcon],
  template: `
    <div
      class="swipe-root"
      (touchstart)="onTouchStart($event)"
      (touchmove)="onTouchMove($event)"
      (touchend)="onTouchEnd()"
      [class.swipe-open]="open()"
    >
      <div class="swipe-actions-panel" [style.width.px]="actionsWidth">
        @for (action of actions(); track action.label; let i = $index) {
          <button
            class="swipe-action-btn"
            [style.background]="action.color"
            (click)="action.action(); reset()"
          >
            <app-icon [icon]="action.icon" class="text-white" />
            <span>{{ action.label }}</span>
          </button>
        }
      </div>
      <div
        class="swipe-content"
        [style.transform]="'translateX(' + offset() + 'px)'"
      >
        <ng-content />
      </div>
    </div>
  `,
  styles: [
    `
      .swipe-root {
        position: relative;
        overflow: hidden;
      }
      .swipe-actions-panel {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        z-index: 0;
      }
      .swipe-action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 64px;
        border: none;
        cursor: pointer;
        font-size: var(--ds-font-size-micro);
        color: var(--ds-on-primary);
        transition: opacity 0.1s;
        padding: 0.25rem;
      }
      .swipe-action-btn:active {
        opacity: 0.8;
      }
      .swipe-content {
        position: relative;
        z-index: 1;
        background: var(--ds-bg-surface);
        transition: transform 0.2s ease;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileSwipeActions extends SwipeActionsBase {}
