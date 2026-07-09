import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { StepsBase } from "@ui/base/steps.base";
import { StepsModule } from "primeng/steps";

@Component({
  selector: "ili-steps",

  imports: [StepsModule],
  template: `<p-steps
    [model]="model()"
    [readonly]="readonly()"
    [activeIndex]="activeIndex()"
    (activeIndexChange)="activeIndex.set($event)"
    [class]="styleClass()"
  ></p-steps>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSteps extends StepsBase {}
