import { NgTemplateOutlet } from "@angular/common";
import { Component, inject, viewChild } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { PopoverBase } from "@ui/core/popover.base";
import { MobilePopover } from "@ui/mobile/popover/popover";
import { AppPopover } from "@ui/web/popover/popover";

@Component({
  selector: "lux-popover",

  imports: [NgTemplateOutlet, AppPopover, MobilePopover],
  template: `
    <!-- Un único ng-content: Angular asigna el contenido proyectado a un solo
         slot; duplicarlo en ramas @if deja la rama no-else vacía. -->
    <ng-template #projected><ng-content /></ng-template>
    @if (platform.isMobile()) {
      <lux-popover-mobile
        #inner
        [styleClass]="styleClass()"
        [appendTo]="appendTo()"
        [dismissable]="dismissable()"
        [autoZIndex]="autoZIndex()"
        [focusOnShow]="focusOnShow()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-popover-mobile>
    } @else {
      <lux-popover-web
        #inner
        [styleClass]="styleClass()"
        [appendTo]="appendTo()"
        [dismissable]="dismissable()"
        [autoZIndex]="autoZIndex()"
        [focusOnShow]="focusOnShow()"
      >
        <ng-container [ngTemplateOutlet]="projected" />
      </lux-popover-web>
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
