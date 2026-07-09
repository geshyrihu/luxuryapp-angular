import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { SplitbuttonBase } from "@ui/base/splitbutton.base";
import { SplitButtonModule } from "primeng/splitbutton";

@Component({
  selector: "app-splitbutton",
  standalone: true,
  imports: [SplitButtonModule],
  template: `<p-splitButton [label]="label()" [model]="model()" [size]="size()" [severity]="severity()" [disabled]="disabled()" (onClick)="onClick.emit($event)" [class]="styleClass()"></p-splitButton>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppSplitbutton extends SplitbuttonBase {}
