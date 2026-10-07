import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { InfiniteScrollBase } from "@ui/core/infinite-scroll.base";
import { MobileInfiniteScroll } from "@ui/mobile/infinite-scroll/infinite-scroll";
import { InfiniteScroll } from "@ui/web/infinite-scroll/infinite-scroll";

@Component({
  selector: "lux-infinite-scroll",

  imports: [InfiniteScroll, MobileInfiniteScroll],
  template: `
    @if (platform.isMobile()) {
      <lux-infinite-scroll-mobile
        [loading]="loading()"
        [threshold]="threshold()"
        [disabled]="disabled()"
        (loadMore)="loadMore.emit()"
      />
    } @else {
      <lux-infinite-scroll-web
        [loading]="loading()"
        [threshold]="threshold()"
        [disabled]="disabled()"
        (loadMore)="loadMore.emit()"
      />
    }
  `,
})
export class LxInfiniteScroll extends InfiniteScrollBase {
  protected platform = inject(PlatformService);
}
