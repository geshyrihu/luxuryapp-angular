import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

export interface SwipeAction {
  icon: string;
  label: string;
  color: string;
  action: () => void;
}

@Component({
  selector: "app-swipe-actions",
  standalone: true,
  imports: [CommonModule, AppIcon],
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
      <div class="swipe-content" [style.transform]="'translateX(' + offset() + 'px)'">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
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
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: #fff;
      transition: opacity 0.1s;
      padding: 0.25rem;
    }
    .swipe-action-btn:active {
      opacity: 0.8;
    }
    .swipe-content {
      position: relative;
      z-index: 1;
      background: var(--ds-bg-surface, #ffffff);
      transition: transform 0.2s ease;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class SwipeActions {
  actions = input.required<SwipeAction[]>();
  threshold = input<number>(40);

  offset = signal(0);
  open = signal(false);
  private startX = 0;
  private currentX = 0;

  get actionsWidth(): number {
    return this.actions().length * 64;
  }

  onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
  }

  onTouchMove(event: TouchEvent): void {
    this.currentX = event.touches[0].clientX;
    const diff = this.startX - this.currentX;

    if (diff > 0) {
      this.offset.set(Math.min(-diff, -this.actionsWidth));
      this.open.set(diff > 20);
    } else if (this.open()) {
      const reveal = Math.max(diff, -this.actionsWidth);
      this.offset.set(reveal);
    }
  }

  onTouchEnd(): void {
    if (this.open() && this.offset() < -(this.actionsWidth / 2)) {
      this.offset.set(-this.actionsWidth);
    } else {
      this.reset();
    }
  }

  reset(): void {
    this.offset.set(0);
    this.open.set(false);
  }
}
