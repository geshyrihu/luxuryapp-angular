import { ChangeDetectionStrategy, Component, viewChild } from "@angular/core";
import { Popover, PopoverModule } from "primeng/popover";
import { PopoverBase } from "@ui/base/popover.base";

@Component({
  selector: "app-popover",
  standalone: true,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
