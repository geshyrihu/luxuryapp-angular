import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppSkeleton } from "@ui/web/skeleton/skeleton";
import { MobileSkeleton } from "@ui/mobile/skeleton/skeleton";
import { SkeletonBase } from "@ui/base/skeleton.base";

@Component({
  selector: "lx-skeleton",
  standalone: true,
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