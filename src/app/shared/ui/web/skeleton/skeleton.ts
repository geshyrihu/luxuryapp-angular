import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SkeletonBase } from "@ui/base/skeleton.base";
import { SkeletonModule } from "primeng/skeleton";

@Component({
  selector: "app-skeleton",

  imports: [SkeletonModule],
  template: `
    <p-skeleton
      [width]="width()"
      [height]="height()"
      [borderRadius]="borderRadius()"
      [class]="styleClass()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSkeleton extends SkeletonBase {}
