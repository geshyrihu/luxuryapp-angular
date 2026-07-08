import { Component, inject } from "@angular/core";
import { VirtualScrollerBase } from "@ui/base/virtual-scroller.base";
import { MobileVirtualScroller } from "@ui/mobile/virtual-scroller/virtual-scroller";
import { AppVirtualScroller } from "@ui/web/virtual-scroller/virtual-scroller";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-virtual-scroller",

  imports: [AppVirtualScroller, MobileVirtualScroller],
  template: `
    @if (platform.isMobile()) {
      <ili-virtual-scroller
        [items]="items()"
        [itemSize]="itemSize()"
        [scrollHeight]="scrollHeight()"
      />
    } @else {
      <app-virtual-scroller
        [items]="items()"
        [itemSize]="itemSize()"
        [scrollHeight]="scrollHeight()"
      />
    }
  `,
})
export class LxVirtualScroller extends VirtualScrollerBase {
  protected platform = inject(PlatformService);
}
