import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { PopoverBase } from "@ui/base/popover.base";
import { Popover, PopoverModule } from "primeng/popover";

@Component({
  selector: "app-popover",

  imports: [PopoverModule],
  template: `
    <p-popover
      #inner
      [styleClass]="styleClass()"
      [appendTo]="appendTo()"
      [dismissable]="dismissable()"
      [autoZIndex]="autoZIndex()"
      [focusOnShow]="focusOnShow()"
    >
      <ng-content />
    </p-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPopover extends PopoverBase {
  private inner = viewChild.required<Popover>("inner");

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
