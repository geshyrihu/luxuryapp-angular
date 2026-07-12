import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { PopoverBase } from "@ui/base/popover.base";
import { IonPopover } from "@ionic/angular/standalone";

@Component({
  selector: "ili-popover",
  imports: [IonPopover],
  template: `
    <ion-popover
      #inner
      [dismissOnSelect]="dismissable()"
      [class]="styleClass()"
    >
      <ng-template>
        <ng-content />
      </ng-template>
    </ion-popover>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobilePopover extends PopoverBase {
  private inner = viewChild.required<any>("inner");

  toggle(event?: any): void {
    if (this.inner().isOpen) {
      this.inner().dismiss();
    } else {
      this.inner().present(event);
    }
  }

  show(event?: any): void {
    this.inner().present(event);
  }

  hide(): void {
    this.inner().dismiss();
  }
}
