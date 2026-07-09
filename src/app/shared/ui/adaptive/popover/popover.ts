import { Component, inject, viewChild } from "@angular/core";
import { PopoverBase } from "@ui/base/popover.base";
import { MobilePopover } from "@ui/mobile/popover/popover";
import { AppPopover } from "@ui/web/popover/popover";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-popover",

  imports: [AppPopover, MobilePopover],
  template: `
    @if (platform.isMobile()) {
      <ili-popover
        #inner
        [styleClass]="styleClass()"
        [appendTo]="appendTo()"
        [dismissable]="dismissable()"
        [autoZIndex]="autoZIndex()"
        [focusOnShow]="focusOnShow()"
      >
        <ng-content />
      </ili-popover>
    } @else {
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
    }
  `,
})
export class LxPopover extends PopoverBase {
  protected platform = inject(PlatformService);
  private inner = viewChild<any>("inner");

  toggle(event?: any): void {
    this.inner()?.toggle(event);
  }

  show(event?: any): void {
    this.inner()?.show(event);
  }

  hide(): void {
    this.inner()?.hide();
  }
}
