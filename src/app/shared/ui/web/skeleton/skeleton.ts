import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SkeletonBase } from "@ui/base/skeleton.base";

@Component({
  selector: "app-skeleton",

  imports: [NgClass],
  template: `
    <div
      class="ds-skeleton"
      [ngClass]="styleClass()"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="borderRadius()"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSkeleton extends SkeletonBase {}
