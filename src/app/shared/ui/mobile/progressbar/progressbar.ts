import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ProgressbarBase } from "@ui/base/progressbar.base";
import { ProgressBarModule } from "primeng/progressbar";

@Component({
  selector: "ili-progressbar",
  standalone: true,
  imports: [ProgressBarModule],
  template: `<p-progressBar [value]="value()" [style]="style()" [showValue]="showValue()" [color]="color()" [class]="styleClass()"></p-progressBar>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileProgressbar extends ProgressbarBase {}
