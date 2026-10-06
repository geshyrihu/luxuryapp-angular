import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { SkeletonBase } from "@ui/core/skeleton.base";
import { MobileSkeleton } from "@ui/mobile/skeleton/skeleton";
import { AppSkeleton } from "@ui/web/skeleton/skeleton";

@Component({
  selector: "lux-skeleton",

  imports: [AppSkeleton, MobileSkeleton],
  template: `
    @if (platform.isMobile()) {
      <ili-skeleton
        [width]="width()"
        [height]="height()"
        [borderRadius]="borderRadius()"
      />
    } @else {
      <lux-skeleton-web
        [width]="width()"
        [height]="height()"
        [borderRadius]="borderRadius()"
        [styleClass]="styleClass()"
      />
    }
  `,
})
export class LxSkeleton extends SkeletonBase {
  protected platform = inject(PlatformService);
}
