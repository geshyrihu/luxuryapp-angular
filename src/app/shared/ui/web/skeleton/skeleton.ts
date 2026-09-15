import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SkeletonBase } from "@ui/base/skeleton.base";

@Component({
  selector: "app-skeleton",

  imports: [],
  template: `
    <div
      class="ds-skeleton"
      [class]="styleClass()"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="borderRadius()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSkeleton extends SkeletonBase {}
