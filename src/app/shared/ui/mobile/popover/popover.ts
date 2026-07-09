import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { PopoverBase } from "@ui/base/popover.base";
import { AppPopover } from "@ui/web/popover/popover";

@Component({
  selector: "ili-popover",

  imports: [AppPopover],
  template: `
    <app-popover
      #inner
      [styleClass]="styleClass()"
      [appendTo]="appendTo()"
      [dismissable]="dismissable()"
      [autoZIndex]="autoZIndex()"
      [focusOnShow]="focusOnShow()"
    >
      <ng-content />
    </app-popover>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobilePopover extends PopoverBase {
  private inner = viewChild.required<AppPopover>("inner");

  toggle(event?: any): void {
    this.inner().toggle(event);
  }

  show(event?: any): void {
    this.inner().show(event);
  }

  hide(): void {
    this.inner().hide();
  }
}
