import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { IonSkeletonText } from "@ionic/angular/standalone";
import { SkeletonBase } from "@ui/base/skeleton.base";

@Component({
  selector: "ili-skeleton",
  standalone: true,
  imports: [IonSkeletonText],
  template: `
    <ion-skeleton-text
      [animated]="true"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="borderRadius()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSkeleton extends SkeletonBase {}