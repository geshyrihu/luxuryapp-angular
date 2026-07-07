import { Directive, input, signal } from "@angular/core";

export interface SwipeAction {
  icon: string;
  label: string;
  color: string;
  action: () => void;
}

@Directive()
export abstract class SwipeActionsBase {
  actions = input.required<SwipeAction[]>();
  threshold = input<number>(40);

  offset = signal(0);
  open = signal(false);
  protected startX = 0;
  protected currentX = 0;

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
