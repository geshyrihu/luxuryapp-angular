import { Component, inject } from "@angular/core";
import { SkeletonBase } from "@ui/base/skeleton.base";
import { MobileSkeleton } from "@ui/mobile/skeleton/skeleton";
import { AppSkeleton } from "@ui/web/skeleton/skeleton";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-skeleton",

  imports: [AppSkeleton, MobileSkeleton],
  template: `
    @if (platform.isMobile()) {
      <ili-skeleton
        [width]="width()"
        [height]="height()"
        [borderRadius]="borderRadius()"
      />
    } @else {
      <app-skeleton
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
